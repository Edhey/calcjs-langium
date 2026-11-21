import type { AstNode, LangiumCoreServices, LangiumDocument } from 'langium';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { URI } from 'langium';

export class CalcDocumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CalcDocumentError';
    }
}

export function formatDocumentErrors(document: LangiumDocument): string[] {
    const errors: string[] = [];
    const lexerErrors = document.parseResult?.lexerErrors ?? [];
    for (const lexerError of lexerErrors) {
        const line = lexerError.line ?? 1;
        const column = lexerError.column ?? 1;
        errors.push(`Lexing error on line ${line}, column ${column}: ${lexerError.message}`);
    }

    const diagnostics = (document.diagnostics ?? []).filter(diagnostic => diagnostic.severity === 1);
    for (const diagnostic of diagnostics) {
        const line = diagnostic.range.start.line + 1;
        const column = diagnostic.range.start.character + 1;
        const offending = document.textDocument.getText(diagnostic.range);
        const detail = offending ? ` [${offending}]` : '';
        errors.push(`Syntax/validation error on line ${line}, column ${column}: ${diagnostic.message}${detail}`);
    }

    if (errors.length === 0) {
        for (const parserError of document.parseResult?.parserErrors ?? []) {
            const token = parserError.token;
            const line = token?.startLine ?? 1;
            const column = token?.startColumn ?? 1;
            errors.push(`Syntax error on line ${line}, column ${column}: ${parserError.message ?? 'Unexpected input'}`);
        }
    }
    return errors;
}

export async function extractDocument(fileName: string, services: LangiumCoreServices): Promise<LangiumDocument> {
    const extensions = services.LanguageMetaData.fileExtensions;
    if (!extensions.includes(path.extname(fileName))) {
        throw new CalcDocumentError(`Please choose a file with one of these extensions: ${extensions}.`);
    }

    if (!fs.existsSync(fileName)) {
        throw new CalcDocumentError(`File ${fileName} does not exist.`);
    }

    const document = await services.shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(fileName)));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    const errors = formatDocumentErrors(document);
    if (errors.length > 0) {
        throw new CalcDocumentError(errors.join('\n'));
    }

    return document;
}

export async function extractAstNode<T extends AstNode>(fileName: string, services: LangiumCoreServices): Promise<T> {
    return (await extractDocument(fileName, services)).parseResult?.value as T;
}

interface FilePathData {
    destination: string,
    name: string
}

export function extractDestinationAndName(filePath: string, destination: string | undefined): FilePathData {
    filePath = path.basename(filePath, path.extname(filePath)).replace(/[.-]/g, '');
    return {
        destination: destination ?? path.join(path.dirname(filePath), 'generated'),
        name: path.basename(filePath)
    };
}
