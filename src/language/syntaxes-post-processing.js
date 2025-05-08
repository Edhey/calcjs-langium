import fs from 'fs';
import path from 'path';

const tmLanguagePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'syntaxes', 'calc-script.tmLanguage.json');

try {
    const data = fs.readFileSync(tmLanguagePath, 'utf8');
    const grammar = JSON.parse(data);

    const booleanRule = {
        name: "constant.language.boolean.calcscript",
        match: "\\b(?:true|false)\\b"
    };

    const keywordRule = {
        name: "keyword.calcscript",
        match: "\\b(?:class|gamma|Complex|objectFunctionObject|functionObject|arrayObject|min|max|print|write)\\b"
    };

    if (!grammar.patterns) {
        grammar.patterns = [];
    }
    grammar.patterns.unshift(booleanRule);
    grammar.patterns.unshift(keywordRule);

    fs.writeFileSync(tmLanguagePath, JSON.stringify(grammar, null, 4), 'utf8');
    console.log("Syntax post-processing applyed suscefully.");
} catch (error) {
    console.error("Error al modificar el archivo TextMate:", error);
}
