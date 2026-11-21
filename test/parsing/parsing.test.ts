import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { parseHelper } from "langium/test";
import { createCalcScriptServices } from "../../src/language/calc-script-module.js";
import { Model, isModel } from "../../src/language/generated/ast.js";

let services: ReturnType<typeof createCalcScriptServices>;
let parse: ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createCalcScriptServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.CalcScript);
});

describe('Parsing tests', () => {

    test('parse simple CalcScript model', async () => {
        document = await parse(`
            x = 10,
            y = x + 5
        `);

        expect(checkDocumentValid(document)).toBeUndefined();
        expect(document?.parseResult.value.expressions.length).toBe(2);
    });
});

function checkDocumentValid(document: LangiumDocument): string | undefined {
    return document.parseResult.parserErrors.length && s`
        Parser errors:
          ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
    `
        || document.parseResult.value === undefined && `ParseResult is 'undefined'.`
        || !isModel(document.parseResult.value) && `Root AST object is a ${document.parseResult.value.$type}, expected a '${Model}'.`
        || undefined;
}