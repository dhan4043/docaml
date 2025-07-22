// Interpret the AST
function interpret(ast) {
  let environment = {};
  let lastExpressionValue;

  function evaluate(node) {
    switch (node.type) {
      case NODE.NUMBER:
        return node.value;
      case NODE.BOOL:
        return node.value;
      case NODE.STRING:
        return node.value;
      case NODE.VAR:
        if (environment.hasOwnProperty(node.value)) {
          return environment[node.value];
        } else {
          throw new Error(`Variable ${node.value} not defined`);
        }
      case NODE.LET:
        const variable = node.variable.value;
        const expressionValue = evaluate(node.expression);
        environment[variable] = expressionValue;
        return expressionValue;
      case NODE.DEF:
        const name = node.name;
        const params = node.params.map(param => param.value);
        environment[name] = { params, body: node.body };
        console.log(environment[name])
        return undefined; // Function definition does not produce a value
      case NODE.APP:
        const funcName = node.func;
        const args = node.args.map(arg => evaluate(arg));
        console.log(args);
        console.log(environment)
        if (environment.hasOwnProperty(funcName)) {
          const { params, body } = environment[funcName];

          if (params.length !== args.length) {
            throw new Error(`Function ${funcName} expects ${params.length} arguments, but ${args.length} were provided`);
          }

          // Evaluate the application in a temporary environment
          const funcEnv = Object.assign({}, environment);
          const savedEnv = environment;
          for (let i = 0; i < params.length; i++) {
            funcEnv[params[i]] = args[i];
          }
          environment = funcEnv;

          const appVal = evaluate(body);

          // Restore the environment
          environment = savedEnv;
          return appVal;
        } else {
          throw new Error(`Function ${funcName} not defined`);
        }
      case NODE.PRIM2:
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        if (INTERP_OP2[node.operator]) {
          assertNumber(left);
          assertNumber(right);
          return INTERP_OP2[node.operator](left, right);
        } else {
          throw new Error(`Unknown operator: ${node.operator}`);
        }
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  for (const statement of ast.body) {
    console.log(statement)
    lastExpressionValue = evaluate(statement.expression);
  }

  return lastExpressionValue;
}

// Throw an error if value is not of type number
function assertNumber(value) {
  if (typeof value != "number")
    throw new Error(`Expected argument of type Number, received type ${typeof value}`);
}
