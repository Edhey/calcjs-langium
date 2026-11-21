import type { Model } from '../language/generated/ast.js';
import * as path from 'node:path';
import * as url from 'node:url';
import pkg from 'template-file';
import { JavaScriptTranspiler } from './transpile.js';

const { renderFile } = pkg;
const projectRoot = path.resolve(url.fileURLToPath(new URL('../..', import.meta.url)));

export async function generateJavaScript(model: Model, returnLast = false): Promise<string> {
    let code = JavaScriptTranspiler.transpile(model, returnLast);
    const dependencies = Array.from(JavaScriptTranspiler.getDependencies());

    if (dependencies.length > 0) {
        code = await renderFile(path.join(projectRoot, 'src/code-generation/templates.txt'), {
            dependencies,
            root: projectRoot,
            code
        });
    }

    return code;
}
