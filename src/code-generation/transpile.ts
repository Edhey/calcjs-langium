import { AbsoluteValueExpression, ArrayLiteral, AssignmentExpression, BinaryExpression, BooleanLiteral, CallExpression, CallLiteral, DoWhileExpression, ForExpression, FunctionDeclaration, Identifier, isAbsoluteValueExpression, isArrayLiteral, isAssignmentExpression, isBinaryExpression, isBooleanLiteral, isCallExpression, isCallLiteral, isDoWhileExpression, isExpression, isForExpression, isFunctionDeclaration, isIdentifier, isKeyValuePair, isNotExpression, isNullLiteral, isNumberLiteral, isObjectLiteral, isStringLiteral, isUnaryPostfixExpression, isUnarySubExpression, isWhileExpression, KeyValuePair, NotExpression, NullLiteral, NumberLiteral, ObjectLiteral, StringLiteral, UnaryPostfixExpression, UnarySubExpression, WhileExpression, type Expression, type Model } from '../language/generated/ast.js';
import * as supportLib from './support-lib.js';

const supportLibraryNames = new Set(Object.keys(supportLib));

export function findDependencies(model: Model): Set<string>[] {
  const dependencies: Set<string> = new Set();
  const declaredVariables: Set<string> = new Set();

  function exploreExpression(expr: Expression, inFunction = false): void {
    if (isAssignmentExpression(expr)) {
      const left = expr.left;
      if (isIdentifier(left)) {
        if (!inFunction) {
          declaredVariables.add(left.name);
        }
      }
      exploreExpression(expr.right, inFunction);
    } else if (isForExpression(expr)) {
      exploreExpression(expr.init, false);
      exploreExpression(expr.condition, false);
      exploreExpression(expr.update, false);
      expr.body.forEach(bodyExpression => exploreExpression(bodyExpression, false));
    } else if (isWhileExpression(expr)) {
      exploreExpression(expr.condition, false);
      expr.body.forEach(bodyExpression => exploreExpression(bodyExpression, false));
    } else if (isDoWhileExpression(expr)) {
      expr.body.forEach(bodyExpression => exploreExpression(bodyExpression, false));
      exploreExpression(expr.condition, false);
    } else if (isBinaryExpression(expr)) {
      exploreExpression(expr.left, inFunction);
      exploreExpression(expr.right, inFunction);
    } else if (isUnaryPostfixExpression(expr)) {
      exploreExpression(expr.operand, inFunction);
    } else if (isUnarySubExpression(expr)) {
      exploreExpression(expr.operand, inFunction);
    } else if (isAbsoluteValueExpression(expr)) {
      exploreExpression(expr.operand, inFunction);
    } else if (isNotExpression(expr)) {
      exploreExpression(expr.operand, inFunction);
    } else if (isFunctionDeclaration(expr)) {
      expr.body.forEach(bodyExpression => exploreExpression(bodyExpression, true));
    } else if (isCallLiteral(expr)) {
      expr.calls.forEach(call => call.arguments.forEach(arg => exploreExpression(arg, inFunction)));
    } else if (isCallExpression(expr)) {
      exploreExpression(expr.callee, inFunction);
      expr.arguments.forEach(arg => exploreExpression(arg, inFunction));
    } else if (isArrayLiteral(expr)) {
      expr.elements.forEach(element => exploreExpression(element, inFunction));
    } else if (isObjectLiteral(expr)) {
      expr.properties.forEach(property => exploreExpression(property.value, inFunction));
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
  private static dependenciesNames: Set<string> = supportLibraryNames;
  private static functionParameterCounts: Map<string, number> = new Map();

  /**
   * Transpiles a CalcScript model into JavaScript code.
   * @param model The CalcScript model to transpile
   * @returns The transpiled JavaScript code
   */
  public static transpile(model: Model, returnLast = false): string {
    this.dependencies.clear();
    this.functionParameterCounts.clear();
    for (const expression of model.expressions) {
      if (isAssignmentExpression(expression)
        && isIdentifier(expression.left)
        && isFunctionDeclaration(expression.right)) {
        this.functionParameterCounts.set(expression.left.name, expression.right.parameters.length);
      }
    }
    const allDependencies = findDependencies(model);
    this.dependencies = allDependencies[0];
    const declaredVariablesSet = allDependencies[1];
    let jsCode = '';
    if (declaredVariablesSet.size > 0) {
      jsCode = 'let ';
      jsCode += Array.from(declaredVariablesSet)
        .map(variable => '$' + variable)
        .join(', ');
      jsCode += ';\n';
    }
    const lastExpression = model.expressions[model.expressions.length - 1];
    const shouldReturnLast = returnLast
      && model.expressions.length > 0
      && lastExpression !== undefined
      && !isForExpression(lastExpression)
      && !isWhileExpression(lastExpression)
      && !isDoWhileExpression(lastExpression);
    const expressionsToTranspile = shouldReturnLast
      ? model.expressions.slice(0, -1)
      : model.expressions;
    jsCode += expressionsToTranspile
      .map(expr => this.transpileExpression(expr))
      .join(';\n');
    if (expressionsToTranspile.length > 0) {
      jsCode += ';';
    }
    if (shouldReturnLast && lastExpression) {
      const transpiledLastExpression = this.transpileExpression(lastExpression);
      jsCode += `\nexport const __lastValue = ${transpiledLastExpression};`;
    }
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
    if (expr.operator === '&') {
      this.dependencies.add('min');
      return `min(${left}, ${right})`;
    }
    if (expr.operator === '@') {
      this.dependencies.add('max');
      return `max(${left}, ${right})`;
    }
    const operator = this.transpileOperator(expr.operator);
    return `${left}${operator}${right}${operator[operator.length - 1] == '(' ? ')' : ''}`;
  }

  private static transpileAbsoluteValueExpression(expr: AbsoluteValueExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `${operand}.abs()`;
  }

  private static transpileUnaryPostfixExpression(expr: UnaryPostfixExpression): string {
    const operand = this.transpileExpression(expr.operand);
    if (expr.operator === '!') {
      this.dependencies.add('gamma');
      return `gamma(${operand})`;
    }
    return `${operand}${this.transpileOperator(expr.operator)}`;
  }

  private static transpileUnarySubExpression(expr: UnarySubExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `${operand}.neg()`;
  }

  private static transpileNotExpression(expr: NotExpression): string {
    const operand = this.transpileExpression(expr.operand);
    return `${operand}.not()`;
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
    if (this.dependenciesNames.has(functionName)) {
      this.dependencies.add(functionName);
    } else {
      functionName = '$' + functionName;
    }
    let calls = '';
    for (const call of expr.calls) {
      const args = call.arguments.map((arg: Expression) => this.transpileExpression(arg));
      const parameterCount = this.functionParameterCounts.get(expr.callee.name);
      if (!this.dependenciesNames.has(expr.callee.name)
        && args.length > 1
        && parameterCount === 1) {
        calls += `(${args[0]})`;
        for (const arg of args.slice(1)) {
          calls += `(${arg})`;
        }
      } else {
        calls += `(${args.join(', ')})`;
      }
    }
    return `${functionName}${calls}`;
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
    if (this.dependenciesNames.has(expr.name)) {
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

  private static transpileNullLiteral(_expr: NullLiteral): string {
    return 'null';
  }

  private static transpileFunctionDeclaration(expr: FunctionDeclaration): string {
    const nameInvocation = 'functionObject';
    this.dependencies.add(nameInvocation);
    const args = expr.parameters.map((param) => this.transpileIdentifier(param)).join(', ');
    const localVariables = new Set<string>();
    for (const statement of expr.body) {
      this.collectDirectAssignments(statement, localVariables);
    }
    for (const parameter of expr.parameters) {
      localVariables.delete(parameter.name);
    }
    const declarations = Array.from(localVariables)
      .map(variable => `$${variable}`)
      .join(', ');
    const statements = expr.body.map((stmt: Expression) => this.transpileExpression(stmt));
    if (statements.length === 0) {
      const emptyBody = declarations ? `let ${declarations};` : '';
      return `${nameInvocation}(function(${args}) {${emptyBody}})`;
    }
    const last = statements[statements.length - 1];
    const prefix = statements.slice(0, -1).map(s => `${s};`).join('\n');
    const declarationPrefix = declarations ? `let ${declarations};` : '';
    const bodyPrefix = [declarationPrefix, prefix].filter(Boolean).join('\n');
    const body = bodyPrefix ? `${bodyPrefix}\nreturn ${last};` : `return ${last};`;
    return `${nameInvocation}(function(${args}) {\n${body}\n})`;
  }

  private static collectDirectAssignments(expr: Expression, variables: Set<string>): void {
    if (isAssignmentExpression(expr)) {
      if (isIdentifier(expr.left)) {
        variables.add(expr.left.name);
      }
      this.collectDirectAssignments(expr.right, variables);
    } else if (isForExpression(expr) || isWhileExpression(expr) || isDoWhileExpression(expr)) {
      if (isForExpression(expr)) {
        this.collectDirectAssignments(expr.init, variables);
        this.collectDirectAssignments(expr.condition, variables);
        this.collectDirectAssignments(expr.update, variables);
      }
      expr.body.forEach(bodyExpression => this.collectDirectAssignments(bodyExpression, variables));
    } else if (isFunctionDeclaration(expr)) {
      return;
    } else if (isBinaryExpression(expr)) {
      this.collectDirectAssignments(expr.left, variables);
      this.collectDirectAssignments(expr.right, variables);
    } else if (isCallLiteral(expr)) {
      expr.calls.forEach(call => call.arguments.forEach(arg => this.collectDirectAssignments(arg, variables)));
    } else if (isCallExpression(expr)) {
      this.collectDirectAssignments(expr.callee, variables);
      expr.arguments.forEach(arg => this.collectDirectAssignments(arg, variables));
    }
  }

  private static transpileAssignmentExpression(expr: AssignmentExpression): string {
    const right = this.transpileExpression(expr.right);
    if (isCallLiteral(expr.left)) {
      const callee = this.transpileExpression(expr.left.callee);
      const args = expr.left.calls
        .flatMap(call => call.arguments)
        .map((arg: Expression) => this.transpileExpression(arg))
        .join(', ');
      return `${callee}.assign([${args}], ${right})`;
    }
    if (isCallExpression(expr.left)) {
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
      case '==':
        return '.equals(';
      case '!=':
        return '.notEquals(';
      case '<':
        return '.lessThan(';
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