import { AbsoluteValueExpression, ArrayLiteral, AssignmentExpression, BinaryExpression, BooleanLiteral, CallExpression, CallLiteral, DoWhileExpression, ForExpression, FunctionDeclaration, Identifier, isAbsoluteValueExpression, isArrayLiteral, isAssignmentExpression, isBinaryExpression, isBooleanLiteral, isCallExpression, isCallLiteral, isDoWhileExpression, isExpression, isForExpression, isFunctionDeclaration, isIdentifier, isKeyValuePair, isNotExpression, isNullLiteral, isNumberLiteral, isObjectLiteral, isStringLiteral, isUnaryPostfixExpression, isUnarySubExpression, isWhileExpression, KeyValuePair, NotExpression, NullLiteral, NumberLiteral, ObjectLiteral, StringLiteral, UnaryPostfixExpression, UnarySubExpression, WhileExpression, type Expression, type Model } from '../language/generated/ast.js';
import * as supportLib from './support-lib.js';

export function findDependencies(model: Model): Set<string>[] {
  const dependencies: Set<string> = new Set();
  // const dependenciesNames = Object.keys(supportLib);
  const declaredVariables: Set<string> = new Set();

  function exploreExpression(expr: Expression): void {
    // if (isCallLiteral(expr)) {
    //   const call = expr as CallLiteral;
    //   if (!isIdentifier(call.callee)) {
    //     throw new Error('It is not possible to call a non-identified function');
    //   }
    //   const functionName = call.callee.name;
    //   if (dependenciesNames.includes(functionName)) {
    //     dependencies.add(functionName);
    //   }
    //   call.arguments.forEach(arg => exploreExpression(arg));
    // } else if (isBinaryExpression(expr)) {
    //   exploreExpression(expr.left);
    //   exploreExpression(expr.right);
    // } else if (isNumberLiteral(expr)) {
    //   dependencies.add('Complex');
    // } else if (isIdentifier(expr)) {
    //   if (dependenciesNames.includes(expr.name)) {
    //     dependencies.add(expr.name);
    //   }
    //   if (!declaredVariables.has(expr.name)) {
    //     declaredVariables.add(expr.name);
    //   }
    // }
    if (isAssignmentExpression(expr)) {
      const left = expr.left;
      if (isIdentifier(left)) {
        declaredVariables.add(left.name);
      }
      exploreExpression(expr.right);
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
      .join(';\n') + ';';
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
    } else if (isCallExpression(expr)) {
      return this.transpileCallExpression(expr);
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
    } else if (isForExpression(expr)) {
      return this.transpileForExpression(expr);
    } else if (isWhileExpression(expr)) {
      return this.transpileWhileExpression(expr);
    } else if (isDoWhileExpression(expr)) {
      return this.transpileDoWhileExpression(expr);
    } else if (isArrayLiteral(expr)) {
      return this.transpileArrayLiteral(expr);
    } else if (isObjectLiteral(expr)) {
      return this.transpileObjectLiteral(expr);
    } else if (isUnaryPostfixExpression(expr)) {
      return this.transpileUnaryPostfixExpression(expr);
    } else if (isUnarySubExpression(expr)) {
      return this.transpileUnarySubExpression(expr);
    } else if (isAbsoluteValueExpression(expr)) {
      return this.transpileAbsoluteValueExpression(expr);
    } else if (isNotExpression(expr)) {
      return this.transpileNotExpression(expr);
    } else if (isExpression(expr)) {
      return this.transpileExpression(expr);
    } else if (isKeyValuePair(expr)) {
      return this.transpileKeyValuePair(expr);
    }
    return '';
  }

  private static transpileArrayLiteral(expr: ArrayLiteral): string {
    const elements = expr.elements.map((element: Expression) => this.transpileExpression(element)).join(', ');
    this.dependencies.add('arrayObject');
    return `arrayObject(${elements})`;
  }

  private static transpileObjectLiteral(expr: ObjectLiteral): string {
    const properties = expr.properties.map((property: KeyValuePair) => this.transpileKeyValuePair(property)).join(', ');
    this.dependencies.add('objectFunctionObject');
    return `objectFunctionObject({${properties}})`;
  }

  private static transpileKeyValuePair(expr: KeyValuePair): string {
    const value = this.transpileExpression(expr.value);
    return `'${expr.key}': ${value}`;
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
    const operator = this.transpileOperator(expr.operator);
    return `${left}${operator}${right}${operator[operator.length - 1] == '(' ? ')' : ''}`; // TODO: Error handling for unsupported operators??
  }

  private static transpileAbsoluteValueExpression(expr: AbsoluteValueExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `${operand}.abs()`;
  }

  private static transpileUnaryPostfixExpression(expr: UnaryPostfixExpression): string {
    const operand = this.transpileExpression(expr.operand);
    let operator = this.transpileOperator(expr.operator);
    if (operator === '!') {
      this.dependencies.add('gamma');
      return `gamma(${operand})`;
    }
    return `${operand}${operator}`;
  }

  private static transpileUnarySubExpression(expr: UnarySubExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `${operand}.neg()`;
  }

  private static transpileNotExpression(expr: NotExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `!${operand}`;
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
    let functionName = expr.callee.name;
    if (this.dependenciesNames.includes(functionName)) {
      this.dependencies.add(functionName);
    } else {
      functionName = '$' + functionName;
    }
    const args = expr.arguments.map((arg: Expression) => this.transpileExpression(arg)).join(', ');
    return `${functionName}(${args})`;
  }

  private static transpileCallExpression(expr: CallExpression): string {
    const callee = this.transpileExpression(expr.callee);
    const args = expr.arguments.map((arg: Expression) => this.transpileExpression(arg)).join(', ');
    return `${callee}(${args})`;
  }

  /**
   * Transpiles a NumberLiteral into JavaScript code using the Complex library.
   * It adds the 'Complex' dependency to the list of dependencies.
   * @param expr The NumberLiteral to transpile
   */
  private static transpileNumberLiteral(expr: NumberLiteral): string {
    this.dependencies.add('Complex');
    return `Complex('${expr.value}')`;
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
    return expr.value;
  }

  private static transpileNullLiteral(expr: NullLiteral): string {
    return 'null';
  }

  private static transpileFunctionDeclaration(expr: FunctionDeclaration): string {
    const nameInvocation = 'functionObject';
    this.dependencies.add(nameInvocation);
    const args = expr.parameters.map((param) => this.transpileIdentifier(param)).join(', ');
    const body = expr.body.map((stmt: Expression) => this.transpileExpression(stmt)).join(';\n') + ';';
    return `${nameInvocation}(function(${args}) {\nreturn ${body}\n})`;
  }

  private static transpileAssignmentExpression(expr: AssignmentExpression): string {
    const right = this.transpileExpression(expr.right);
    if (isCallLiteral(expr.left) || isCallExpression(expr.left)) {
      const callee = this.transpileExpression(expr.left.callee);
      const args = expr.left.arguments.map((arg: Expression) => this.transpileExpression(arg)).join(', ');
      return `${callee}.assign([${args}], ${right})`;
    }
    const left = this.transpileExpression(expr.left);
    return `${left} = ${right}`;
  }

  private static transpileForExpression(expr: ForExpression): string {
    const init = this.transpileExpression(expr.init);
    const condition = this.transpileExpression(expr.condition);
    const update = this.transpileExpression(expr.update);
    const body = expr.body.map((stmt: Expression) => this.transpileExpression(stmt)).join(';\n');
    return `for (${init}; ${condition}; ${update}) {\n${body}\n}`;
  }

  private static transpileWhileExpression(expr: WhileExpression): string {
    const condition = this.transpileExpression(expr.condition);
    const body = expr.body.map((stmt: Expression) => this.transpileExpression(stmt)).join(';\n');
    return `while (${condition}) {\n${body}\n}`;
  }

  private static transpileDoWhileExpression(expr: DoWhileExpression): string {
    const body = expr.body.map((stmt: Expression) => this.transpileExpression(stmt)).join(';\n');
    const condition = this.transpileExpression(expr.condition);
    return `do {\n${body}\n} while (${condition});`;
  }

  public static transpileOperator(operator: string): string {
    switch (operator) {
      case '+':
        return '.add(';
      case '-':
        return '.sub(';
      case '*':
        return '.mul(';
      case '/':
        return '.div(';
      case '**':
        return '.pow(';
      default:
        return ` ${operator} `;
    }
  }

  /**
   * Get the dependencies collected during the last transpilation.
   */
  public static getDependencies(): Set<string> {
    return new Set(this.dependencies);
  }
}