grammar CalcScript

entry Model:
  expression=Expression;

Expression infers Expression:
    head=Literal rest+=SequenceExpression*;

SequenceExpression:
    separator=',' element=Literal;

Literal infers Expression:
   value=Number | value=String | value=Boolean | value=Null | value=Identifier;

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

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
hidden terminal WS: /\s+/;

terminal TRUE: /true/;
terminal FALSE: /false/;
terminal NULL: /null/;
terminal NUMBER: /\d+(\.\d+)?([eE][-+]?\d+)?i?|i/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal PID: /print|write/;
terminal ID: /[a-zA-Z_][$\w]*/;
