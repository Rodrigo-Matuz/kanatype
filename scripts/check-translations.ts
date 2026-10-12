import en from "../src/i18n/en.json";
import ptBR from "../src/i18n/pt-BR.json";
import { validateCatalog } from "../src/i18n/translation";

validateCatalog(en, ptBR);
console.log(`Translation keys and placeholders match (${Object.keys(en).length} keys).`);
