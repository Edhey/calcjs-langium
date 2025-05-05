import { BinaryExpression, FunctionCall, Identifier, isBinaryExpression, isFunctionCall, isNumberLiteral, NumberLiteral, type Expression, type Model } from '../language/generated/ast.js';
import { GenerateOptions } from '../cli/main.js';
// import * as supportLib from './support-lib.js';


export function transpileJavaScript(model: Model, options: GenerateOptions): string {
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
  } else if (isFunctionCall(expr)) {
    return transpileFunctionCall(expr);
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
 * Transpiles a NumberLiteral into JavaScript code. Uses the Complex function 
 * to create a complex number.
 * @param expr The NumberLiteral to transpile
 * @returns The transpiled JavaScript code
 */
function transpileNumberLiteral(expr: NumberLiteral): string {
  // Crea un nodo FunctionCall para "Complex"
  const complexCall: FunctionCall = {
    $type: "FunctionCall",
    callee: { $type: "Identifier", name: "Complex" } as Identifier,
    args: [{ $type: "NumberLiteral", value: expr.value } as NumberLiteral],
  } as FunctionCall;
  return transpileExpression(complexCall);
  // return `Complex(${expr.value})`;
}

function transpileFunctionCall(expr: FunctionCall): string {
  const callee = transpileExpression(expr.callee);
  let args = null;
  if (callee === 'Complex') {
    args = expr.args
  } else {
    args = expr.args.map(arg => transpileExpression(arg)).join(', ');
  }
  return `${callee}(${args})`;
}