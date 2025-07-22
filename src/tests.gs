function testInterpreter() {
  const output = JSON.stringify(interpret(parse(tokenize(`let x = 5`))));
  console.log(output);
}
