// Tokenize, parse and interpret the document's text
function interp() {
  const input = DocumentApp.getActiveDocument().getBody().getText();
  
  // Benchmarking - Start Time
  const startTime = new Date().getTime();

  // Tokenize, parse, and interpret
  const output = interpret(parse(tokenize(input)));

  // Benchmarking - End Time
  const endTime = new Date().getTime();

  // Display execution time in the result output
  const benchmarkOutput = `\n\nTook ${(endTime - startTime)/ 1000} seconds`;

  // Display the output along with benchmark information
  return "Output: " + output + benchmarkOutput;
}

function genTokens() {
  const input = DocumentApp.getActiveDocument().getBody().getText();
  
  // Benchmarking - Start Time
  const startTime = new Date().getTime();

  // Tokenize, parse, and interpret
  const output = tokenize(input);

  // Benchmarking - End Time
  const endTime = new Date().getTime();

  // Display execution time in the result output
  const benchmarkOutput = `\n\nTook ${(endTime - startTime)/ 1000} seconds`;

  // Display the output along with benchmark information
  return JSON.stringify(output, null, 2) + benchmarkOutput;
}

function genAst() {
  const input = DocumentApp.getActiveDocument().getBody().getText();
  
  // Benchmarking - Start Time
  const startTime = new Date().getTime();

  // Tokenize, parse, and interpret
  const output = parse(tokenize(input));

  // Benchmarking - End Time
  const endTime = new Date().getTime();

  // Display execution time in the result output
  const benchmarkOutput = `\n\nTook ${(endTime - startTime)/ 1000} seconds`;

  // Display the output along with benchmark information
  return JSON.stringify(output, null, 2) + benchmarkOutput;
}
