import { BinaryExpression, CallExpression, isBinaryExpression, isCallExpression, isIdentifier, isNumberLiteral, NumberLiteral, type Expression, type Model } from '../language/generated/ast.js';
import * as supportLib from './support-lib.js';

export function findDependencies(model: Model): Set<string> {
  const dependencies: Set<string> = new Set();
  const dependenciesNames = Object.keys(supportLib);

  function exploreExpression(expr: Expression): void {
    if (isCallExpression(expr)) {
      const callExpression = expr as CallExpression;
      if (!isIdentifier(callExpression.callee)) {
        throw new Error('It is not possible to call a non-identified function');
      }
      const functionName = callExpression.callee.name;
      if (dependenciesNames.includes(functionName)) {
        dependencies.add(functionName);
      }
      callExpression.arguments.forEach(arg => exploreExpression(arg));
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

/**
 * Class to transpile CalcScript expressions into JavaScript code.
 * It collects dependencies during the transpilation process.
 */
export class JavaScriptTranspiler {
  private static dependencies: Set<string> = new Set();
  private static dependenciesNames: string[] = Object.keys(supportLib);

  /**
   * Transpiles a CalcScript model into JavaScript code.
   * @param model The CalcScript model to transpile
   * @returns The transpiled JavaScript code
   */
  public static transpile(model: Model): string {
    this.dependencies.clear();
    return model.expressions
      .map(expr => this.transpileExpression(expr))
      .join(';\n');
  }

  /**
   * Function to transpile a CalcScript expression into JavaScript code.
   * @param expr The expression to transpile
   * @returns The transpiled JavaScript code
   */
  public static transpileExpression(expr: Expression): string {
    if (isNumberLiteral(expr)) {
      return this.transpileNumberLiteral(expr);
    } else if (isBinaryExpression(expr)) {
      return this.transpileBinaryExpression(expr);
    } else if (isCallExpression(expr)) {
      return this.transpileFunctionCall(expr);
    }
    return '';
  }

  /**
   * Transpiles a BinaryExpression into JavaScript code.
   * It transpiles the left and right operands and combines them with the 
   * operator.
   * @param expr The BinaryExpression to transpile
   * @returns The transpiled JavaScript code
   * @throws Error if the operator is not supported
   */
  private static transpileBinaryExpression(expr: BinaryExpression): string {
    const left = this.transpileExpression(expr.left);
    const right = this.transpileExpression(expr.right);
    return `${left} ${expr.op} ${right}`; // TODO: Error handling for unsupported operators??
  }

  /**
   * Transpiles a CallExpression into JavaScript code.
   * It adds the function name to the list of dependencies if it is a supported 
   * function.
   * @param expr The CallExpression to transpile
   * @returns The transpiled JavaScript code
   */
  private static transpileFunctionCall(expr: CallExpression): string {
    if (!isIdentifier(expr.callee)) {
      throw new Error('It is not possible to call a non-identified function');
    }
    const functionName = expr.callee.name;
    if (this.dependenciesNames.includes(functionName)) {
      this.dependencies.add(functionName);
    }
    const args = expr.arguments.map((arg: Expression) => this.transpileExpression(arg)).join(', ');
    return `${functionName}(${args})`;
  }

  /**
   * Transpiles a NumberLiteral into JavaScript code using the Complex library.
   * It adds the 'Complex' dependency to the list of dependencies.
   * @param expr The NumberLiteral to transpile
   */
  private static transpileNumberLiteral(expr: NumberLiteral): string {
    this.dependencies.add('Complex');
    return `Complex(${expr.value})`;
  }

  /**
   * Get the dependencies collected during the last transpilation.
   */
  public static getDependencies(): Set<string> {
    return new Set(this.dependencies);
  }
}