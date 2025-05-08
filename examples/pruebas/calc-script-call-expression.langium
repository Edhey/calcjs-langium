grammar CalcScript

/**
 * Regla de entrada: 
 * El programa es una lista de expresiones separadas por comas
 */
entry Model:
  expressions+=Expression (',' expressions+=Expression)*;

/**
 * Todas las expresiones se unifican en la regla Expression.
 * Aquí se hace el "dispatch" a las distintas formas de expresión.
 */
Expression infers Expression:
  ControlExpression 
  | AssignmentExpression
  | CallExpression
;

ControlExpression infers Expression:
  ForExpression
    | WhileExpression
    | DoWhileExpression
;

fragment Block:
  '{' body+=Expression (',' body+=Expression )* '}';

ForExpression infers ForExpression:
  'for' '(' init=Expression ';' condition=Expression ';' update=Expression ')' Block;

WhileExpression infers WhileExpression:
  'while' condition=Expression Block;

DoWhileExpression infers DoWhileExpression:
  'do' Block 'while' '(' condition=Expression ')';

ArrayExpression infers ArrayExpression:
  '[' elements+=Expression ( ';' elements+=Expression )* ']';

ObjectExpression infers ObjectExpression:
  '{' props+=KeyValue ( ';' props+=KeyValue )* '}';

KeyValue:
  key=STRING ':' value=Expression;

/**
 * La asignación '=' es _right associative_, es decir, se agrupa de derecha a izquierda.
 */
AssignmentExpression infers Expression:
  EqualityExpression
  | Identifier '=' AssignmentExpression {infer AssignmentExpression}
;

/**
 * Operadores de igualdad: '==' y '!=' (izquierda asociativa)
 */
EqualityExpression infers Expression:
  LogicalExpression ({infer BinaryExpression.left=current} op=('==' | '!=') right=LogicalExpression)*;

/**
 * Operadores lógicos: '&&' y '||' (izquierda asociativa)
 */
LogicalExpression infers Expression:
  ComparativeExpression ({infer BinaryExpression.left=current} op=('&&' | '||') right=ComparativeExpression)*;

/**
 * Operador relacional: '<'
 */
ComparativeExpression infers Expression:
  AbsoluteValueExpression ({infer BinaryExpression.left=current} op=('<') right=AbsoluteValueExpression)*;

/**
 * Operador no asociativo: '|' x '|'
 * Se aplica a la expresión de valor absoluto.
 */
AbsoluteValueExpression infers Expression:
  '|' AbsoluteValueExpression '|' {infer AbsoluteValueExpression.left=current}
  | MaxExpression
;

/**
 * Operador izquierdo: '@'
 */
MaxExpression infers Expression:
  MinExpression ({infer BinaryExpression.left=current} op=('@') right=MinExpression)*;

/**
 * Operador izquierdo: '&'
 */
MinExpression infers Expression:
  AdditiveExpression ({infer BinaryExpression.left=current} op=('&') right=AdditiveExpression)*;

/**
 * Operadores de adición y sustracción ('+' y '-'), izquierda asociativa
 */
AdditiveExpression infers Expression:
  MultiplicativeExpression ({infer BinaryExpression.left=current} op=('+' | '-') right=MultiplicativeExpression)*;

/**
 * Operadores de multiplicación y división ('*' y '/'), izquierda asociativa
 */
MultiplicativeExpression infers Expression:
  UnarySubExpression ({infer BinaryExpression.left=current} op=('*' | '/') right=UnarySubExpression)*;

/**
 * Operador unario: UMINUS (no asociativo)
 * Se define en la regla UnarySubExpression, junto con otros posibles operadores unarios.
 */
UnarySubExpression infers Expression:
  '-' UnarySubExpression {infer UnarySubExpression.op=current}  // UMINUS
    | ExponentiationExpression
;

/**
 * Operador de exponenciación '**' es right associative.
 * Se implementa mediante recursión a la derecha.
 */
ExponentiationExpression infers Expression:
  ExponentialExpression ({infer BinaryExpression.left=current} op='**' right=ExponentiationExpression)*;

/**
 * Operador postfix: '!'
 * Se aplica a la expresión exponencial.
 */
ExponentialExpression infers Expression:
  NotExpression ({infer ExponentialExpression.op+=current} op+='!' )*;

/**
 * Operador unario: '!'
 * Se aplica el operador NOT logico.
 */
NotExpression infers Expression:
  '!' NotExpression
  | PrimaryExpression ({infer ExponentialExpression.op+=current} op+='!' )*;

/**
 * Expresión primaria: 
 * - Paréntesis
 * - Literales (números, cadenas, booleanos, nulos)
 * - Identificadores
 */
PrimaryExpression infers Expression:
  '(' Expression ')' 
  | NumberLiteral 
  | StringLiteral 
  | BooleanLiteral 
  | NullLiteral 
  | Identifier 
  | ArrayExpression 
  | ObjectExpression 
  | FunctionExpression
;

NumberLiteral infers NumberLiteral:
  value=NUMBER;

StringLiteral infers StringLiteral:
  value=STRING;

BooleanLiteral infers BooleanLiteral:
  value=(TRUE | FALSE);

NullLiteral infers NullLiteral:
  value=NULL;

Identifier infers Identifier:
  name=ID;

FunctionExpression infers FunctionExpression:
  'fun' ('(' arguments+=ID (';' arguments+=ID)*)* ')' Block;

CallExpression infers CallExpression:
  callee=AssignmentExpression ('(' arguments+=Expression (';' arguments+=Expression)* ')')*;

terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[a-zA-Z_][$\w]*/;
terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|i/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal HASH_SL_COMMENT: /#.*/;
hidden terminal WS: /\s+/;