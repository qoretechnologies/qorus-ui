/**
* SQL patterns
*
* @author Petr Chalupny based on code PL/SQL from Ray Myers
* @version 1.0.0
*/
Rainbow.extend( "sql", [
  {
    name: "constant",
    pattern: /\b(false|null|true)\b/gi
  },
  {
    // see http://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
    name: "keyword",
//	An attempt at listing the most common keywords. Add to this as needed.     
    pattern: /\b(begin|end|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant|all|partial|global|month|current_timestamp|using|go|revoke|smallint|indicator|end-exec|disconnect|zone|with|character|assertion|to|add|current_user|usage|input|local|alter|match|collate|real|then|rollback|get|read|timestamp|session_user|not|integer|bit|unique|day|minute|desc|insert|execute|like|ilike|2|level|decimal|drop|continue|isolation|found|where|constraints|domain|right|national|some|module|transaction|relative|second|connect|escape|close|system_user|for|deferred|section|cast|current|sqlstate|allocate|intersect|deallocate|numeric|public|preserve|full|goto|initially|asc|no|key|output|collation|group|by|union|session|both|last|language|constraint|column|of|space|foreign|deferrable|prior|connection|unknown|action|commit|view|or|first|into|float|year|primary|cascaded|except|restrict|set|references|names|table|outer|open|select|size|are|rows|from|prepare|distinct|leading|create|only|next|inner|authorization|schema|corresponding|option|declare|precision|immediate|else|timezone_minute|external|varying|translation|true|case|exception|join|hour|default|double|scroll|value|cursor|descriptor|values|dec|fetch|procedure|delete|and|false|int|is|describe|char|as|at|in|varchar|null|trailing|any|absolute|current_time|end|grant|privileges|when|cross|check|write|current_date|pad|begin|temporary|exec|time|update|catalog|user|sql|date|on|identity|timezone_hour|natural|whenever|interval|work|order|cascade|diagnostics|nchar|having|left|call|do|handler|load|replace|truncate|start|lock|show|pragma|exists|number|trigger|if|before|after|each|row|count|sum|min|max|avg)\b/gi
  },
  {
    name: "string",
    pattern: /'([^']|(''))*'/g
  },
  {
    name: "number",
  	pattern: /\b[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\b/g
  },
  {
    name: "comment",
    pattern: /\/\*[\s\S]*?\*\/|(--).*?$/gm
  },
  {
    name: "operator",
    pattern: /(\+{1,2}|-{1,2}|~|!|\*|\/|%|(?:&lt;){1,2}|(?:&gt;){1,3}|(?:&amp;){1,2}|\^|\|{1,2}|\?|:|(?:=|!|\+|-|\*|\/|%|\^|\||:=|(?:&lt;){1,2}|(?:&gt;){1,3})?=)/g
  }
], true );