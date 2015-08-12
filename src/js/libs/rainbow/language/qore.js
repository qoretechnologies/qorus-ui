/**
* Qore patterns
*c
* @author P. Chalupny
* @version 1.0.0
*/
Rainbow.extend( "qore", [
  {
    name: "constant",
    pattern: /\b(false|null|true|[A-Z_]+)\b/g
  },
  {
    matches: {
      1: "keyword",
      2: "support.namespace"
    },
    pattern: /(requires)\s(.+)/g
  },
  {
    matches: {
      1: 'variable.dollar-sign',
      2: 'variable'
    },
    pattern: /(\$)(\w+)\b/g
  },
  {
    name: 'keyword.dot',
    pattern: /\./g
  },
  {
    name: "keyword",
    pattern: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|my|native|new|our|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g
  },
  {
    name: "string",
    pattern: /(".*?")/g
  },
  {
    name: "char",
    pattern: /(')(.|\\.|\\u[\dA-Fa-f]{4})\1/g
  },
  {
    name: "integer",
    pattern: /\b(0x[\da-f]+|\d+)L?\b/g
  },
  {
    name: "comment",
    pattern: /\/\*[\s\S]*?\*\/|(#).*?$/gm
  },
  {
    matches: {
      1: "entity.function"
    },
    pattern: /([^@\.\s]+)\(/g
  },
  {
    matches: {
      1: 'storage.function',
      2: 'support.magic'
    },
    pattern: /(sub)\s+(\w+)(?=\()/g
  },
  // {
  //   matches: {
  //     1: 'support.method'
  //   },
  //   pattern: /\.(?=\()/g
  // },
  {
    name: "entity.class",
    pattern: /\b([A-Z]\w*)\b/g
  },
  {
    name: "operator",
    pattern: /(\+{1,2}|-{1,2}|~|!|\*|\/|%|(?:&lt;){1,2}|(?:&gt;){1,3}|instanceof|(?:&amp;){1,2}|\^|\|{1,2}|\?|:|(?:=|!|\+|-|\*|\/|%|\^|\||(?:&lt;){1,2}|(?:&gt;){1,3})?=)/g
  }
], true );
