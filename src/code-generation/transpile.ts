import { AssignmentExpression, BinaryExpression, BooleanLiteral, CallLiteral, FunctionDeclaration, Identifier, isAssignmentExpression, isBinaryExpression, isBooleanLiteral, isCallLiteral, isFunctionDeclaration, isIdentifier, isNullLiteral, isNumberLiteral, isStringLiteral, NullLiteral, NumberLiteral, StringLiteral, type Expression, type Model } from '../language/generated/ast.js';
import * as supportLib from './support-lib.js';

export function findDependencies(model: Model): Set<string>[] {
  const dependencies: Set<string> = new Set();
  const dependenciesNames = Object.keys(supportLib);
  const declaredVariables: Set<string> = new Set();

  function exploreExpression(expr: Expression): void {
    if (isCallLiteral(expr)) {
      const call = expr as CallLiteral;
      if (!isIdentifier(call.callee)) {
        throw new Error('It is not possible to call a non-identified function');
      }
      const functionName = call.callee.name;
      if (dependenciesNames.includes(functionName)) {
        dependencies.add(functionName);
      }
      call.arguments.forEach(arg => exploreExpression(arg));
    } else if (isBinaryExpression(expr)) {
      exploreExpression(expr.left);
      exploreExpression(expr.right);
    } else if (isNumberLiteral(expr)) {
      dependencies.add('Complex');
    } else if (isIdentifier(expr)) {
      if (dependenciesNames.includes(expr.name)) {
        dependencies.add(expr.name);
      }
      if (!declaredVariables.has(expr.name)) {
        declaredVariables.add(expr.name);
      }
    }
  }

  model.expressions.forEach(expr => exploreExpression(expr));
  return [dependencies, declaredVariables];
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
    const allDependencies = findDependencies(model);
    this.dependencies = allDependencies[0];
    const declaredVariablesSet = allDependencies[1];
    this.dependencies.clear();
    let jsCode = '';
    if (declaredVariablesSet.size > 0) {
      jsCode = 'let ';
      jsCode += Array.from(declaredVariablesSet)
        .map(variable => '$' + variable)
        .join(', ');
      jsCode += ';\n';
    }
    jsCode += model.expressions
      .map(expr => this.transpileExpression(expr))
      .join(';\n');
    return jsCode;
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
    } else if (isCallLiteral(expr)) {
      return this.transpileCallLiteral(expr);
    } else if (isIdentifier(expr)) {
      return this.transpileIdentifier(expr);
    } else if (isStringLiteral(expr)) {
      return this.transpileStringLiteral(expr);
    } else if (isBooleanLiteral(expr)) {
      return this.transpileBooleanLiteral(expr);
    } else if (isNullLiteral(expr)) {
      return this.transpileNullLiteral(expr);
    } else if (isFunctionDeclaration(expr)) {
      return this.transpileFunctionDeclaration(expr);
    } else if (isAssignmentExpression(expr)) {
      return this.transpileAssignmentExpression(expr);
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
    return `${left} ${expr.operator} ${right}`; // TODO: Error handling for unsupported operators??
  }

  /**
   * Transpiles a CallLiteral into JavaScript code.
   * It adds the function name to the list of dependencies if it is a supported 
   * function.
   * @param expr The CallLiteral to transpile
   * @returns The transpiled JavaScript code
   */
  private static transpileCallLiteral(expr: CallLiteral): string {
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

  private static transpileIdentifier(expr: Identifier): string {
    if (this.dependenciesNames.includes(expr.name)) {
      this.dependencies.add(expr.name);
    }
    return '$' + expr.name;
  }

  private static transpileStringLiteral(expr: StringLiteral): string {
    return `'${expr.value}'`;
  }

  private static transpileBooleanLiteral(expr: BooleanLiteral): string {
    return Boolean(expr.value).toString();
  }

  private static transpileNullLiteral(expr: NullLiteral): string {
    return 'null';
  }

  private static transpileFunctionDeclaration(expr: FunctionDeclaration): string {
    const nameInvocation = 'functionObject';
    const args = expr.parameters.map((param) => this.transpileIdentifier(param)).join(', ');
    const body = expr.body.map((stmt: Expression) => this.transpileExpression(stmt)).join(';\n');
    return `function ${nameInvocation}(${args}) {\n${body}\n}`;
  }

  private static transpileAssignmentExpression(expr: AssignmentExpression): string {
    return `${this.transpileExpression(expr.left)} = ${this.transpileExpression(expr.right)}`;
  }

  /**
   * Get the dependencies collected during the last transpilation.
   */
  public static getDependencies(): Set<string> {
    return new Set(this.dependencies);
  }
}