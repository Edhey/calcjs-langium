import { BinaryExpression, isBinaryExpression, isNumberLiteral, NumberLiteral, type Expression, type Model } from '../language/generated/ast.js';
import { GenerateOptions } from './main.js';

export function transpileJavaScript(model: Model, filePath: string, options: GenerateOptions): string {
  return model.expressions
    .map(expr => transpileExpression(expr))
    .join(';\n');
}

/**
 * Function to transpile a CalcScript expression into JavaScript code.
 * @param expr The expression to transpile
 * @returns The transpiled JavaScript code
 */
function transpileExpression(expr: Expression): string {
  if (isNumberLiteral(expr)) {
    return transpileNumberLiteral(expr);
  } else if (isBinaryExpression(expr)) {
    return transpileBinaryExpression(expr);
  }
  return '';
}

/**
 * Transpila una BinaryExpression.
 * Para ello, transpila la parte izquierda, luego el operador y la parte derecha.
 */
function transpileBinaryExpression(expr: BinaryExpression): string {
  const left = transpileExpression(expr.left);
  const right = transpileExpression(expr.right);
  // Puedes ajustar los paréntesis según el nivel de precedencia que necesites
  return `(${left} ${expr.op} ${right})`;
}

/**
 * Transpila un NumberLiteral.
 * En este ejemplo, se transforma el literal numérico en una llamada a "Complex".
 */
function transpileNumberLiteral(expr: NumberLiteral): string {
  return `Complex(${expr.value})`;
}
