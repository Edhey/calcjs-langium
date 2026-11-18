grammar CalcScript

/**
 * Regla de entrada: 
 * El programa es una lista de expresiones separadas por comas
 */
entry Module:
  expressions+=Expression (',' expressions+=Expression)*;

/**
 * Todas las expresiones se unifican en la regla Expression.
 * Aquí se hace el "dispatch" a las distintas formas de expresión.
 */
Expression infers Expression:
  AssignmentExpression
;

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
AbsoluteValueExpression infers Expression:
  '|' inner=Expression '|' 
  | MaxExpression;


/**
 * Operador izquierdo: '@'
 */
MaxExpression:
  MinExpression ({infer BinaryExpression.left=current} op=('@') right=MinExpression)*;

/**
 * Operador izquierdo: '&'
 */
MinExpression:
  AdditiveExpression ({infer BinaryExpression.left=current} op=('&') right=AdditiveExpression)*;

/**
 * Operadores de adición y sustracción ('+' y '-'), izquierda asociativa
 */
AdditiveExpression:
  MultiplicativeExpression ({infer BinaryExpression.left=current} op=('+' | '-') right=MultiplicativeExpression)*;

/**
 * Operadores de multiplicación y división ('*' y '/'), izquierda asociativa
 */
MultiplicativeExpression:
  UnaryExpression ({infer BinaryExpression.left=current} op=('*' | '/') right=UnaryExpression)*;

/**
 * Operador unario: UMINUS (no asociativo)
 * Se define en la regla UnaryExpression, junto con otros posibles operadores unarios.
 */
UnaryExpression:
  '-' UnaryExpression {infer UnaryExpression.op=current}  // UMINUS
    | ExponentiationExpression
;

/**
 * Operador de exponenciación '**' es _right associative_.
 * Se implementa mediante recursión a la derecha.
 */
ExponentiationExpression:
  ExponentialExpression ( '**' right=ExponentiationExpression )?;

/**
 * Operador postfix: '!'
 * Se aplica repetidamente en ExponentialExpression (por ejemplo, para representar factorial).
 */
ExponentialExpression:
  NotExpression ({infer ExponentialExpression.op+=current} op+='!' )*;

NotExpression:
  '!' NotExpression
  | PrimaryExpression ({infer ExponentialExpression.op+=current} op+='!' )*;

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

PrimaryExpression infers Expression:
  '(' Expression ')' | Number | String | Boolean | Null | Identifier;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal WS: /\s+/;

terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|i/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[a-zA-Z_][$\w]*/;
