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
  ControlExpression | AssignmentExpression
;

ControlExpression infers Expression:
  ForExpression
    | WhileExpression
    | DoWhileExpression
;

fragment Block:
  '{' body+=Expression (',' body+=Expression )* '}';

ForExpression infers Expression:
  'for' '(' init=Expression ';' condition=Expression ';' update=Expression ')' Block;

WhileExpression infers Expression:
  'while' condition=Expression Block;

DoWhileExpression infers Expression:
  'do' Block 'while' '(' condition=Expression ')';

ArrayExpression infers Expression:
  '[' elements+=Expression ( ';' elements+=Expression )* ']';

ObjectExpression infers Expression:
  '{' props+=KeyValue ( ';' props+=KeyValue )* '}';

KeyValue:
  key=STRING ':' value=Expression;

FunctionExpression infers Expression:
  'fun' '(' params+=ID (';' params+=ID)* ')' Block;


/**
 * La asignación '=' es _right associative_, es decir, se agrupa de derecha a izquierda.
 */
AssignmentExpression infers AssignmentExpression:
  EqualityExpression
  | Identifier '=' AssignmentExpression {infer AssignmentExpression}
;

/**
 * Operadores de igualdad: '==' y '!=' (izquierda asociativa)
 */
EqualityExpression infers EqualityExpression:
  LogicalExpression ({infer BinaryExpression.left=current} op=('==' | '!=') right=LogicalExpression)*;

/**
 * Operadores lógicos: '&&' y '||' (izquierda asociativa)
 */
LogicalExpression infers LogicalExpression:
  ComparativeExpression ({infer BinaryExpression.left=current} op=('&&' | '||') right=ComparativeExpression)*;

/**
 * Operador relacional: '<'
 */
ComparativeExpression infers ComparativeExpression:
  AbsoluteValueExpression ({infer BinaryExpression.left=current} op=('<') right=AbsoluteValueExpression)*;

/**
 * Operador no asociativo: '|' x '|'
 * Se aplica a la expresión de valor absoluto.
 */
AbsoluteValueExpression infers AbsoluteValueExpression:
  '|' inner=Expression '|' 
  | MaxExpression
;

/**
 * Operador izquierdo: '@'
 */
MaxExpression infers MaxExpression:
  MinExpression ({infer BinaryExpression.left=current} op=('@') right=MinExpression)*;

/**
 * Operador izquierdo: '&'
 */
MinExpression infers MinExpression:
  AdditiveExpression ({infer BinaryExpression.left=current} op=('&') right=AdditiveExpression)*;

/**
 * Operadores de adición y sustracción ('+' y '-'), izquierda asociativa
 */
AdditiveExpression infers AdditiveExpression:
  MultiplicativeExpression ({infer BinaryExpression.left=current} op=('+' | '-') right=MultiplicativeExpression)*;

/**
 * Operadores de multiplicación y división ('*' y '/'), izquierda asociativa
 */
MultiplicativeExpression infers MultiplicativeExpression:
  UnaryExpression ({infer BinaryExpression.left=current} op=('*' | '/') right=UnaryExpression)*;

/**
 * Operador unario: UMINUS (no asociativo)
 * Se define en la regla UnaryExpression, junto con otros posibles operadores unarios.
 */
UnaryExpression infers UnaryExpression:
  '-' UnaryExpression {infer UnaryExpression.op=current}  // UMINUS
    | ExponentiationExpression
;

/**
 * Operador de exponenciación '**' es _right associative_.
 * Se implementa mediante recursión a la derecha.
 */
ExponentiationExpression infers ExponentiationExpression:
  ExponentialExpression ({infer BinaryExpression.left=current} op='**' right=ExponentiationExpression)*;

/**
 * Operador postfix: '!'
 * Se aplica a la expresión exponencial.
 */
ExponentialExpression infers ExponentialExpression:
  NotExpression ({infer ExponentialExpression.op+=current} op+='!' )*;

/**
 * Operador unario: '!'
 * Se aplica el operador NOT logico.
 */
NotExpression infers NotExpression:
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
  | Number 
  | String 
  | Boolean 
  | Null 
  | Identifier 
  | ArrayExpression 
  | ObjectExpression 
  | FunctionExpression
;

Number infers Expression:
  value=NUMBER;

String infers Expression:
  value=STRING;

Boolean infers Expression:
  value=(TRUE | FALSE);

Null infers Expression:
  value=NULL;

Identifier infers Expression:
  name=ID;

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