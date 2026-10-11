{
  description = "KanataType — NixOS and Home Manager installation";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # The published .deb is amd64-only.
      pkgs = nixpkgs.legacyPackages.${system};
      lib = nixpkgs.lib;
      version = "1.1.0";
      releaseTag = "v${version}";
      # Package the published native .deb instead of building Tauri, Rust, and
      # frontend dependencies from source. Re-link it against Nixpkgs' GTK and
      # WebKitGTK libraries rather than relying on an AppImage's bundled stack.
      # Update version, literal release tag/asset name, and verified hash for future releases.
      deb = pkgs.fetchurl {
        url = "https://github.com/Rodrigo-Matuz/kanatype/releases/download/${releaseTag}/kanatype_${version}_amd64.deb";
        hash = "sha256-iJYk9dYQpeZZmRuV1ZpBxTGSXEy3f+PXzAdXoK8tK74=";
      };
      package = pkgs.stdenv.mkDerivation {
        pname = "kanatype";
        inherit version;
        src = deb;
        nativeBuildInputs = with pkgs; [ dpkg autoPatchelfHook wrapGAppsHook3 ];
        buildInputs = with pkgs; [
          gtk3 webkitgtk_4_1 libsoup_3 gdk-pixbuf cairo glib glib-networking
          librsvg libayatana-appindicator
        ];
        unpackPhase = ''
          runHook preUnpack
          dpkg-deb -x "$src" .
          runHook postUnpack
        '';
        dontConfigure = true;
        dontBuild = true;
        dontStrip = true;
        installPhase = ''
          runHook preInstall
          install -Dm755 usr/bin/kanatype "$out/bin/kanatype"
          mkdir -p "$out/share"
          cp -r usr/share/. "$out/share/"
          # The 1.1.0 .deb already ships the branded desktop entry.
          runHook postInstall
        '';
        meta = {
          description = "Practice Japanese kana and kanji with instant feedback";
          homepage = "https://github.com/Rodrigo-Matuz/kanatype";
          license = lib.licenses.mit;
          mainProgram = "kanatype";
          platforms = [ system ];
        };
      };
    in
    {
      packages.${system}.default = package;

      homeManagerModules.default = { config, pkgs, lib, ... }:
        let
          cfg = config.programs.kanatype;
        in
        {
          options.programs.kanatype = {
            enable = lib.mkEnableOption "KanataType";
            package = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.stdenv.hostPlatform.system}.default;
              description = "KanataType package to install.";
            };
          };
          config = lib.mkIf cfg.enable {
            home.packages = [ cfg.package ];
          };
        };
    };
}
