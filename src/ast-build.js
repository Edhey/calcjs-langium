/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura Procesadores de Lenguajes
 * Práctica 3 - Hello Compilers
 *
 * @author Himar Edhey Hernández Alonso
 * @since Wed 26 Feb 2025
 * @desc Este archivo contiene las funciones que construyen el AST
 * @see {@link https://github.com/ULL-ESIT-PL-2425/arith2js-himar_edhey-hernandez-alu0101552392}
 */

/** 
 * Build the root node of the AST
 * @param {Object} child - The child node
 * @param {Object} location - The location information
 * @returns {Object} - The root node
 */
function buildRoot(child, location) {
  return {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: child,
      },
    ],
    loc: location,
    sourceType: 'script',
  };
}

/**
 * Build a literal node of the AST
 * @param {string} value - The raw value of the literal
 * @param {Object} location - The location information
 * @returns {Object} - The literal node
 */
function buildLiteral(value, location) {
  return {
    type: 'Literal',
    value: value,
    raw: `"${value}"`,
    loc: location
  };
}

/**
 * Build an identifier node of the AST
 * @param {string} name - The name of the identifier
 * @param {Object} location - The location information
 * @returns {Object} - The identifier node
 */
// function buildIdentifier(name, location) {
function buildIdentifier(name, location) {
  return {
    type: 'Identifier',
    name: name,
    loc: location,
  };
}

/**
 * Build a call expression node of the AST
 * @param {string} callee - The name of the callee
 * @param {Object[]} args - The arguments of the call expression
 * @param {Object} location - The location information
 * @returns {Object} - The call expression node
 */
function buildCallExpression(callee, args, location) {
  return {
    type: 'CallExpression',
    callee: callee,
    arguments: args,
    optional: false,
    loc: location,
  };
}

/**
 * Build an array expression node of the AST
 * @param {Object[]} elements - The elements of the array
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The array expression node
 */
function buildArrayExpression(elements, startLocation, endLocation) {
  return {
    type: 'ArrayExpression',
    elements: elements,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build a call member expression node of the AST
 * @param {Object} callee - The object that calls the member
 * @param {string} member - The member to call
 * @param {Object[]} args - The arguments of the call
 * @param {boolean} computed - If the member is computed
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The call member expression node
 */
function buildCallMemberExpression(callee, member, args, computed = false, startLocation, endLocation) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: callee,
      property: {
        type: 'Identifier',
        name: member,
      },
      computed: computed,
    },
    arguments: args,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build an assignment expression node of the AST
 * @param {Object} left - The left side of the assignment
 * @param {string} operator - The operator of the assignment
 * @param {Object} right - The right side of the assignment
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The assignment expression node
 */
function buildAssigmentExpression(left, operator, right, startLocation, endLocation) {
  return {
    type: 'AssignmentExpression',
    operator: operator,
    left: left,
    right: right,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build a sequence expression node of the AST
 * @param {Object[]} expressions - The expressions of the sequence
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The sequence expression node
 */
function buildSequenceExpression(expressions, startLocation, endLocation) {
  return {
    type: 'SequenceExpression',
    expressions: expressions,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build a variable declaration node of the AST
 * @param {Object[]} declarations - Array of declarations
 * @param {string} kind - Kind of the declaration (e.g., 'let', 'const', 'var')
 * @returns {Object} - The variable declaration node
 */
function buildVariableDeclaration(declarations, kind = 'let') {
  return {
    type: 'VariableDeclaration',
    declarations: declarations,
    kind: kind,
  };
}

/**
 * Build a variable declarator node of the AST
 * @param {Object} id - The identifier of the variable
 * @param {Object} init - The initial value of the variable
 * @returns {Object} - The variable declarator node
 */
function buildVariableDeclarator(id, init = null) {
  return {
    type: 'VariableDeclarator',
    id: id,
    init: init,
  };
}

/**
 * Build a function expression node of the AST
 * @param {Object[]} params - The parameters of the function
 * @param {Object} expression - The body of the function
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The function expression node
 */
function buildFunctionExpression(params, expression, startLocation, endLocation) {
  let wrappedExpression = expression;
  for (let i = params.length - 1; i > 0; i--) {
    wrappedExpression = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'functionObject',
      },
      arguments: [
        {
          type: 'FunctionExpression',
          params: [params[i]],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: wrappedExpression,
                loc: {
                  start: startLocation,
                  end: endLocation,
                },
              },
            ],
            loc: {
              start: startLocation,
              end: endLocation,
            },
          },
          generator: false,
          async: false,
          expression: false,
          loc: {
            start: startLocation,
            end: endLocation,
          },
        },
      ],
      loc: {
        start: startLocation,
        end: endLocation,
      },
    };
  }
    
  let param = "";
  if (params.length > 0) {
    param = params[0];
  }
  return {
    type: 'FunctionExpression',
    id: null,
    params: [param],
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: wrappedExpression,
        }
      ]
    },
    generator: false,
    async: false,
    expression: false,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

// function buildIdCalls(id, calls) {
//   // ! TODO: Implement
//   let node = id;
//   for (let i = 0; i < calls.length; i++) {
//     node = buildCallExpression(node, calls[i].name, calls[i].args, calls[i].computed, calls[i].startLocation, calls[i].endLocation);
//   }
//   return node;
// }

/**
 * Build an identifier or call expression node of the AST
 * @param {string|Object} baseCall - The base call expression
 * @param {Object[]} calls - The calls to make
 * @param {Object} idLocation - The location information of the identifier
 * @param {Object} callLocation - The location information of the call
 * @returns {Object} - The identifier or call expression node
 */
function buildIdentifierOrCalls(baseCall, calls, idLocation, callLocation) {
  let baseExpression = typeof baseCall === 'string' ? buildIdentifier(baseCall, idLocation) : baseCall;

  calls.forEach(ast => {
    let parent = {
      type: 'CallExpression',
      callee: baseExpression,
      arguments: ast === null ? [] : [ast],
      loc: callLocation,
    };
    baseExpression = parent;
  });
  return baseExpression;
}

// function buildParOrCallExpression(par, call, parLocation, callLocation) {
//   let node = par;
//   if (call !== null) {
//     node = {
//       type: 'CallExpression',
//       callee: par,
//       arguments: call,
//       loc: callLocation,
//     };
//   }
//   return node;
// }

/**
 * Build a logical expression node of the AST
 * @param {Object} left - The left side of the expression
 * @param {string} operator - The operator of the expression
 * @param {Object} right - The right side of the expression
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The logical expression node
 */
function buildLogicalExpression(left, operator, right, startLocation, endLocation) {
  return {
    type: 'LogicalExpression',
    operator: operator,
    left: left,
    right: right,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build a unary expression node of the AST
 * @param {string} operator - The operator of the unary expression
 * @param {Object} argument - The argument of the unary expression
 * @param {boolean} prefix - If the operator is prefix
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The unary expression node
 */
function buildUnaryExpression(operator, argument, prefix, startLocation, endLocation) {
  return {
    type: 'UnaryExpression',
    operator: operator,
    argument: argument,
    prefix: prefix,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Builds a while statement AST node.
 * @param {Object} conditionStatement - The condition of the while statement.
 * @param {Object} bodyStatement - The body of the while statement.
 * @param {Object} startLocation - The start location of the while statement.
 * @param {Object} endLocation - The end location of the while statement.
 * @returns {Object} The AST node representing the while statement.
 */
function buildWhileStatement(conditionStatement, bodyStatement, startLocation,
  endLocation) {
  const variableDeclaration = buildVariableDeclaration([
    buildVariableDeclarator(
      buildIdentifier('result'),
      buildLiteral(false)
    )
  ]);
  const whileStatement = {
    type: 'WhileStatement',
    test: conditionStatement,
    body: {
      type: 'BlockStatement',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'result',
          },
          right: bodyStatement
        }
      }]
    },
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
  const returnStatement = {
    type: 'ReturnStatement',
    argument: buildIdentifier('result'),
  };
  const blockStatement = {
    type: 'BlockStatement',
    body: [
      variableDeclaration,
      whileStatement,
      returnStatement
    ],
  };
  const arrowFunctionExpression = {
    type: 'ArrowFunctionExpression',
    id: null,
    params: [],
    body: blockStatement,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  }
  return buildCallExpression(
    arrowFunctionExpression, 
    [], 
    {
      start: startLocation,
      end: endLocation,
    }
  );
}

/**
 * Builds a do-while statement AST node.
 * @param {Object} bodyStatement - The body of the while statement.
 * @param {Object} conditionStatement - The condition of the while statement.
 * @param {Object} startLocation - The start location of the do statement.
 * @param {Object} endLocation - The end location of the while statement.
 * @returns {Object} The AST node representing the while statement.
 */
function buildDoWhileStatement(bodyStatement, conditionStatement, startLocation,
  endLocation) {
  const variableDeclaration = buildVariableDeclaration([
    buildVariableDeclarator(
      buildIdentifier('result'),
      buildLiteral(false)
    )
  ]);
  const doWhileStatement = {
    type: 'DoWhileStatement',
    test: conditionStatement,
    body: {
      type: 'BlockStatement',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'result',
          },
          right: bodyStatement
        }
      }]
    },
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
  const returnStatement = {
    type: 'ReturnStatement',
    argument: buildIdentifier('result'),
  };
  const blockStatement = {
    type: 'BlockStatement',
    body: [
      variableDeclaration,
      doWhileStatement,
      returnStatement
    ],
  };
  const arrowFunctionExpression = {
    type: 'ArrowFunctionExpression',
    id: null,
    params: [],
    body: blockStatement,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  }
  return buildCallExpression(
    arrowFunctionExpression, 
    [], 
    {
      start: startLocation,
      end: endLocation,
    }
  );
}

/**
 * Builds a for statement AST node.
 * @param {Object} init - The initialization part of the for statement.
 * @param {Object} test - The test condition of the for statement.
 * @param {Object} update - The update part of the for statement.
 * @param {Object} body - The body of the for statement.
 * @param {Object} startLocation - The start location of the for statement.
 * @param {Object} endLocation - The end location of the for statement.
 * @returns {Object} The AST node representing the for statement.
 */
function buildForStatement(init, test, update, body, startLocation, endLocation) {
  const resultDeclarator = buildVariableDeclarator(
    buildIdentifier('result'),
    buildLiteral(false)
  );
  const resultDeclaration = buildVariableDeclaration([resultDeclarator], 'let');
  const forStatement = {
    type: 'ForStatement',
    init: init,
    test: test,
    update: update,
    body: {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: body,
        }
      ],
    },
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
  const resultReturn = {
    type: 'ReturnStatement',
    argument: buildIdentifier('result'),
  };
  const arrowFunctionBody = {
    type: 'BlockStatement',
    body: [
      resultDeclaration,
      forStatement,
      resultReturn,
    ],
  };
  const arrowFunction = {
    type: 'ArrowFunctionExpression',
    id: null,
    params: [],
    body: arrowFunctionBody,
    generator: false,
    async: false,
    expression: false,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
  return buildCallExpression(
    arrowFunction, 
    [],
    {
      startLocation, 
      endLocation
    }
  );
}

/**
 * Builds a labeled statement AST node.
 * @param {Object} label - The label of the statement.
 * @param {Object} body - The body of the statement.
 * @param {Object} startLocation - The start location of the labeled statement.
 * @param {Object} endLocation - The end location of the labeled statement.
 * @returns {Object} The AST node representing the labeled statement.
 */
function buildLabeledStatement(label, body, startLocation, endLocation) {
  return {
    type: 'LabeledStatement',
    label: label,
    body: body,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Builds a block statement AST node.
 * @param {Object[]} body - The body of the block statement.
 * @param {Object} startLocation - The start location of the block statement.
 * @param {Object} endLocation - The end location of the block statement.
 * @returns {Object} The AST node representing the block statement.
 */
function buildBlockStatement(body, startLocation, endLocation) {
  return {
    type: 'BlockStatement',
    body: body,
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

/**
 * Build an object expression node of the AST
 * @param {Array} properties - The properties of the object
 * @param {Object} startLocation - The start location information
 * @param {Object} endLocation - The end location information
 * @returns {Object} - The object expression node
 */
function buildObjectExpression(properties, startLocation, endLocation) {
  return {
    type: 'ObjectExpression',
    properties: properties.map(({ key, value }) => ({
      type: 'Property',
      key: buildLiteral(key.value, key.loc), // Clave como un literal
      value: value,
      kind: 'init', // Tipo de propiedad (init para inicialización)
      loc: {
        start: key.loc.start,
        end: value.loc.end,
      },
    })),
    loc: {
      start: startLocation,
      end: endLocation,
    },
  };
}

module.exports = {
  buildRoot,
  buildLiteral,
  buildIdentifier,
  buildCallExpression,
  buildCallMemberExpression,
  buildAssigmentExpression,
  buildSequenceExpression,
  buildVariableDeclaration,
  buildVariableDeclarator,
  buildFunctionExpression,
  buildIdentifierOrCalls,
  // buildParOrCallExpression,
  buildLogicalExpression,
  buildUnaryExpression,
  buildForStatement,
  buildWhileStatement,
  buildDoWhileStatement,
  buildArrayExpression,
  buildLabeledStatement,
  buildBlockStatement,
  buildObjectExpression
};