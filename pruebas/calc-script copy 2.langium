grammar CalcScript

entry Model:
  expression=Expr;

Expr infers Expr:
  Sequence;

Sequence infers Expr:
  Assignment (',' Assignment)*;

Assignment infers Expr:
  Logic (('=' Logic)?);

Logic infers Expr:
  Equality (('&&' | '||') Equality)*;

Equality infers Expr:
  Comparison (('==' | '!=') Comparison)*;

Comparison infers Expr:
  Bitwise (('<' | '>' | '<=' | '>=') Bitwise)*;

Bitwise infers Expr:
  MaxMin (('&' | '@') MaxMin)*;

MaxMin infers Expr:
  Term (('+' | '-') Term)*;

Term infers Expr:
  Factor (('*' | '/') Factor)*;

Factor infers Expr:
  Power ('**' Power)*;

Power infers Expr:
  Unary;

Unary infers Expr:
    ('!' | '-') Unary
  | Postfix;

Postfix infers Expr:
    Primary ( '(' args+=Expr (';' args+=Expr)* ')' )*;

Primary infers Expr:
      ComplexLiteral
    | BooleanLiteral
    | StringLiteral
    | NullLiteral
    | IdentifierExpr
    | ParenExpr
    | ArrayExpr
    | ObjectExpr
    | WhileExpr
    | DoWhileExpr
    | ForExpr
    | FunctionExpr;

ComplexLiteral infers Expr: value=NUMBER;
BooleanLiteral infers Expr: value=(TRUE | FALSE);
StringLiteral infers Expr: value=STRING;
NullLiteral infers Expr: value=NULL;
IdentifierExpr infers Expr: name=ID;
ParenExpr infers Expr: '(' expression=Expr ')';

ArrayExpr infers Expr:
    '[' elements+=Expr ( ';' elements+=Expr )* ']';

ObjectExpr infers Expr:
    '{' props+=KeyValue ( ';' props+=KeyValue )* '}';

KeyValue:
    key=STRING ':' value=Expr;

WhileExpr infers Expr:
    'while' cond=Expr '{' body=Expr '}';

DoWhileExpr infers Expr:
    'do' '{' body=Expr '}' 'while' '(' cond=Expr ')';

ForExpr infers Expr:
    'for' '(' init=Expr ';' cond=Expr ';' update=Expr ')' '{' body=Expr '}';

FunctionExpr infers Expr:
    'fun' '(' params+=ID (';' params+=ID)* ')' '{' body=Expr '}';

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal HASH_SL_COMMENT: /\#.*/;

terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|i/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal PID: /print|write/;
terminal ID: /[a-zA-Z_][$\w]*/;
