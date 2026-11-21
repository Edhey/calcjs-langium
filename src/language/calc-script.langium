grammar CalcScript

/**
 * Regla de entrada:
 * El programa es una lista de expresiones separadas por comas
 */
entry Model:
  expressions+=Expression (',' expressions+=Expression)*
;

/**
 * Todas las expresiones se unifican en la regla Expression.
 */
Expression infers Expression:
  AssignmentExpression
  | ControlExpression
;

ControlExpression infers ControlExpression:
  ForExpression
  | WhileExpression
  | DoWhileExpression
;

fragment Body:
  '{' body+=Expression (',' body+=Expression)* '}'
;

ForExpression infers ForExpression:
  'for' '(' init=Expression ';' condition=Expression ';' update=Expression ')' Body
;

WhileExpression infers WhileExpression:
  'while' condition=Expression Body
;

DoWhileExpression infers DoWhileExpression:
  'do' Body 'while' '(' condition=Expression ')'
;

AssignmentExpression infers Expression:
  CallExpression ({infer AssignmentExpression.left=current} operator='=' right=AssignmentExpression)?
;

CallExpression infers Expression:
  ArithmeticExpression ({infer CallExpression.callee=current} '(' (arguments+=Expression (';' arguments+=Expression)*)? ')')*
;

ArithmeticExpression infers Expression:
  EqualityExpression
;

/**
 * Operadores de igualdad: '==' y '!=' (izquierda asociativa)
 */
EqualityExpression infers Expression:
  LogicalExpression ({infer BinaryExpression.left=current} operator=('==' | '!=') right=LogicalExpression)*
;

/**
 * Operadores lógicos: '&&' y '||' (izquierda asociativa)
 */
LogicalExpression infers Expression:
  ComparativeExpression ({infer BinaryExpression.left=current} operator=('&&' | '||') right=ComparativeExpression)*
;

/**
 * Operador relacional: '<'
 */
ComparativeExpression infers Expression:
  AbsoluteValueExpression ({infer BinaryExpression.left=current} operator='<' right=AbsoluteValueExpression)*
;

/**
 * Valor absoluto: '|' expression '|'
 */
AbsoluteValueExpression infers Expression:
  {infer AbsoluteValueExpression} '|' operand=Expression '|'
  | MaxExpression
;

/**
 * Operador izquierdo: '@' (máximo)
 */
MaxExpression infers Expression:
  MinExpression ({infer BinaryExpression.left=current} operator='@' right=MinExpression)*
;

/**
 * Operador izquierdo: '&' (mínimo)
 */
MinExpression infers Expression:
  AdditiveExpression ({infer BinaryExpression.left=current} operator='&' right=AdditiveExpression)*
;

/**
 * Operadores de adición y sustracción ('+' y '-'), izquierda asociativa
 */
AdditiveExpression infers Expression:
  MultiplicativeExpression ({infer BinaryExpression.left=current} operator=('+' | '-') right=MultiplicativeExpression)*
;

/**
 * Operadores de multiplicación y división ('*' y '/'), izquierda asociativa
 */
MultiplicativeExpression infers Expression:
  UnarySubExpression ({infer BinaryExpression.left=current} operator=('*' | '/') right=UnarySubExpression)*
;

/**
 * Operador unario: UMINUS (no asociativo)
 */
UnarySubExpression infers Expression:
  {infer UnarySubExpression} operator='-' operand=ExponentiationExpression
  | ExponentiationExpression
;

/**
 * Operador de exponenciación '**' (asociativo a la derecha)
 */
ExponentiationExpression infers Expression:
  FactorialExpression ({infer BinaryExpression.left=current} operator='**' right=ExponentiationExpression)?
;

/**
 * Operador postfix: '!' (factorial)
 */
FactorialExpression infers Expression:
  NotExpression ({infer UnaryPostfixExpression.operand=current} operator='!')*
;

/**
 * Operador unario lógico: '!'
 */
NotExpression infers Expression:
  {infer NotExpression} operator='!' operand=PrimaryExpression
  | PrimaryExpression
;

/**
 * Expresión primaria:
 * - Paréntesis
 * - Literales (números, cadenas, booleanos, nulos)
 * - Identificadores, arrays, objetos, funciones y llamadas
 */
PrimaryExpression infers Expression:
  '(' Expression ')'
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  | Identifier
  | ArrayLiteral
  | ObjectLiteral
  | FunctionDeclaration
  | CallLiteral
;

NumberLiteral infers NumberLiteral:
  value=NUMBER
;

StringLiteral infers StringLiteral:
  value=STRING
;

BooleanLiteral infers BooleanLiteral:
  value=(TRUE | FALSE)
;

NullLiteral infers NullLiteral:
  value=NULL
;

Identifier infers Identifier:
  name=ID
;

FunctionDeclaration infers FunctionDeclaration:
  'fun' ('(' (parameters+=Identifier (';' parameters+=Identifier)*)? ')')+ Body
;

ArrayLiteral infers ArrayLiteral:
  '[' (elements+=Expression (';' elements+=Expression)*)? ']'
;

ObjectLiteral infers ObjectLiteral:
  '{' (properties+=KeyValuePair (';' properties+=KeyValuePair)*)? '}'
;

KeyValuePair:
  key=STRING ':' value=Expression
;

CallLiteral infers CallLiteral:
  callee=Identifier calls+=CallArguments+
;

CallArguments:
  '(' (arguments+=Expression (';' arguments+=Expression)*)? ')'
;

terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|(i(?![$\w]))/; // Antes de STRING e ID para reconocer 'i'
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[a-zA-Z_][$\w]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal HASH_SL_COMMENT: /#.*/;
hidden terminal WS: /\s+/;