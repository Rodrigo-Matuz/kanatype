export function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center gap-10 mb-8">
			<h1 className="font-bold text-accent text-4xl tracking-tight">{title}</h1>
			<div className="flex-1 bg-accent h-1" />
		</div>
	);
}