import { BinaryExpression, FunctionCall, isBinaryExpression, isFunctionCall, isNumberLiteral, NumberLiteral, type Expression, type Model } from '../language/generated/ast.js';
import * as supportLib from './support-lib.js';

export function findDependencies(model: Model): Set<string> {
  const dependencies: Set<string> = new Set();
  const functionNames = Object.keys(supportLib);

  function exploreExpression(expr: Expression): void {
    if (isFunctionCall(expr)) {
      const functionName = expr.callee.name;
      if (functionNames.includes(functionName)) {
        dependencies.add(functionName);
      }
      expr.args.forEach(arg => exploreExpression(arg));
    } else if (isBinaryExpression(expr)) {
      exploreExpression(expr.left);
      exploreExpression(expr.right);
    } else if (isNumberLiteral(expr)) {
      dependencies.add('Complex');
    }
  }

  model.expressions.forEach(expr => exploreExpression(expr));
  return dependencies;
}

export class JavaScriptTranspiler {
  private dependencies: Set<string> = new Set();
  private functionNames: string[] = Object.keys(supportLib);

  constructor(private model: Model) { }

  public transpile(): string {
    return this.model.expressions
      .map(expr => this.transpileExpression(expr))
      .join(';\n');
  }

  public getDependencies(): Set<string> {
    return this.dependencies;
  }

  /**
   * Function to transpile a CalcScript expression into JavaScript code.
   * @param expr The expression to transpile
   * @returns The transpiled JavaScript code
   */
  public transpileExpression(expr: Expression): string {
    if (isNumberLiteral(expr)) {
      return this.transpileNumberLiteral(expr);
    } else if (isBinaryExpression(expr)) {
      return this.transpileBinaryExpression(expr);
    } else if (isFunctionCall(expr)) {
      return this.transpileFunctionCall(expr);
    }
    return '';
  }

  /**
   * Transpila una BinaryExpression.
   * Para ello, transpila la parte izquierda, luego el operador y la parte derecha.
   */
  private transpileBinaryExpression(expr: BinaryExpression): string {
    const left = this.transpileExpression(expr.left);
    const right = this.transpileExpression(expr.right);
    return `(${left} ${expr.op} ${right})`;
  }

  /**
   * Transpila una llamada a función.
   */
  private transpileFunctionCall(expr: FunctionCall): string {
    const functionName = expr.callee.name;
    if (this.functionNames.includes(functionName)) {
      this.dependencies.add(functionName);
    }
    const args = expr.args.map((arg: Expression) => this.transpileExpression(arg)).join(', ');
    return `${functionName}(${args})`;
  }

  /**
   * Transpila un NumberLiteral. Se transforma a un número complejo en una 
   * llamada a "Complex".
   */
  private transpileNumberLiteral(expr: NumberLiteral): string {
    this.dependencies.add('Complex');
    return `Complex(${expr.value})`;
  }
}