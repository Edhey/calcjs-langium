%{
const reservedwords = ["fun", "true", "false", "i", "while", "for", "do", "null"]
const predefinedIds = ["print", "write" ] // predefined identifiers

const removeQuotes = text => text.slice(1, -1);

const idOrReserved = text => {
    if (reservedwords.find(w => w == text)) return text.toUpperCase();
    if (predefinedIds.find(w => w == text)) return 'PID';
    return 'ID';
  }
%}
number \d+(\.\d+)?([eE][-+]?\d+)?"i"?|"i"
string \"((?:[^"\\]|\\.)*)\"

%%
\s+                                   /* skip whites */;
'#'.*                                 /* skip comments */;
[/][/].*                              /* skip single line comments */;
[/][*](.|\n)*?[*][/]                  /* skip multiple line comments | The * is greedy so we need to make it lazy with ? */;
{number}                              return 'NUMBER';
{string}                              { yytext = removeQuotes(yytext); return 'STRING'; }
[_$a-zA-Z][$\w]*                      return idOrReserved(yytext);
'=='                                  return '==';
'**'                                  return '**'; // It must be before '*' because it is more specific, otherwise it will be recognized as '*'
'&&'                                  return '&&';
'||'                                  return '||';
'=='                                  return '==';
'!='                                  return '!=';
[-+*/!()&@|=,{}ç<;:]                   return yytext;
']'                                   return ']';
'['                                   return '[';
<<EOF>>                               return 'EOF';