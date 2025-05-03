grammar CalcScript

entry Model:
  statements+=Statement*;

Statement:
  Expression ';' |
  Assignment ';';

Expression:
  FunctionCall | Literal | Identifier;

Assignment:
  left=Identifier '=' right=Expression;

FunctionCall:
  func=Identifier '(' args+=Expression (',' args+=Expression)* ')';

Literal:
  value=NUMBER | value=STRING;

Identifier:
  name=ID;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal WS: /\s+/;

// Keywords
terminal FUN: /fun/;
terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal WHILE: /while/;
terminal FOR: /for/;
terminal DO: /do/;
terminal I: /i/;

terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|i/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

terminal PID: /print|write/;
terminal ID: /[a-zA-Z_][$\w]*/;