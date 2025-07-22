// Parse the tokens into an abstract syntax tree (AST)
function parse(tokens) {
  // Keep track of the current token index
  let currentTokenIndex = 0;

  // Helper function to consume tokens
  function consumeToken() {
    return tokens[currentTokenIndex++];
  }

  // Parse a number
  function parseNumber() {
    return { type: NODE.NUMBER, value: parseInt(consumeToken().value) };
  }

  // Parse a boolean
  function parseBool() {
    return { type: NODE.BOOL, value: consumeToken().value === 'true' };
  }

  // Parse a string
  function parseString() {
    return { type: NODE.STRING, value: consumeToken().value };
  }

  // Parse a function application
  function parseApp(func) {
    const args = [];

    while (currentTokenIndex < tokens.length && tokens[currentTokenIndex].type !== 'SPECIAL') {
      // Parse arguments
      args.push(parsePrimary());
    }

    return { type: NODE.APP, func, args };
  }


  // Parse a variable
  function parseVar() {
    return { type: NODE.VAR, value: consumeToken().value };
  }

  // Parse a binary operation
  function parsePrim2(left) {
    let token = tokens[currentTokenIndex];

    while (token && token.type === 'PRIM2') {
      if (!(OP2[token.value])) throw new Error(`Unexpected operation: ${token.value}`);
      const currentOperator = token.value;
      const precedence = OP2[token.value];
      currentTokenIndex++; // Consume operator

      let right = parsePrimary();

      token = tokens[currentTokenIndex];

      while (token && token.type === 'PRIM2' && OP2[token.value] > precedence) {
        right = parsePrim2(right);
        token = tokens[currentTokenIndex];
      }

      left = { type: NODE.PRIM2, operator: currentOperator, left, right };
    }

    return left;
  }

  // Parse a let expression or function definition
  function parseLet() {
    const variable = parseVar();
    const params = [];

    // Check for function parameters
    while (currentTokenIndex < tokens.length && tokens[currentTokenIndex].type === 'VAR') {
      params.push(parseVar());
    }

    consumeToken(); // Consume '='

    // Check if there are parameters to determine if it's a function definition
    if (params.length > 0) {
      // Function definition
      const body = parseExpression();
      return { type: NODE.DEF, name: variable.value, params, body };
    } else {
      // Regular let expression
      const expression = parseExpression();
      return { type: NODE.LET, variable, expression };
    }
  }

  // Parse a primary expression
  function parsePrimary() {
    const currentToken = tokens[currentTokenIndex];

    switch (currentToken.type) {
      case 'NUMBER':
        return parseNumber();
      case 'BOOL':
        return parseBool();
      case 'STRING':
        return parseString();
      case 'VAR':
        const functionName = currentToken.value;
        consumeToken(); // Consume function name
        // Check if it's a function application
        if (currentTokenIndex < tokens.length && tokens[currentTokenIndex].type !== 'SPECIAL' && tokens[currentTokenIndex].type !== 'PRIM2') {
          return parseApp(functionName);
        } else {
          return { type: NODE.VAR, value: functionName };
        }
      case 'LET':
        return parseLet(); // Updated to handle function definition
      default:
        throw new Error(`Unexpected token: ${currentToken.type}`);
    }
  }

  // Parse an expression
  function parseExpression() {
    return parsePrim2(parsePrimary());
  }

  // Parse a statement
  function parseStatement() {
    return { type: NODE.STATEMENT, expression: parseExpression() };
  }

  // Parse the entire program
  function parseProgram() {
    const program = { type: NODE.PROGRAM, body: [] };

    while (tokens && currentTokenIndex < tokens.length) {
      const statement = parseStatement();
      program.body.push(statement);

      // Consume ';' to mark the end of an expression/statement
      if (currentTokenIndex < tokens.length && tokens[currentTokenIndex].type === 'SPECIAL' && tokens[currentTokenIndex].value === ';') {
        consumeToken(); // Consume ';'
      }
      //else {
      //  throw new Error('Expected \';\' to mark the end of an expression/statement');
      //}
    }

    return program;
  }

  // Start parsing
  return parseProgram();
}
