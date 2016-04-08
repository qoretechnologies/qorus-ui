module.exports = function babelSyntax() {
  return {
    build(functionName, pattern, parameters, comment) {
      return (
        `this.${functionName}(` +
          `${pattern}, ` +
          `async function(${parameters.slice(0, -1).join(', ')}) {\n` +
          `  // ${comment}\n` +
          "  return 'pending';\n" +
          '}' +
        ');'
      );
    },
  };
};
