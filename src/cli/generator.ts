import type { Model } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';
// import { transpile } from '../code-generation/transpile.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    // TODO: Implement the transpile function
    const jsCode = JSON.stringify(model.expression, null, 2); // Debugging purpose
    console.log(jsCode);
    // const jsCode = transpile(model);
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, jsCode);
    return generatedFilePath;
}
