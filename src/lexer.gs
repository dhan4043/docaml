
function tokenize(code) {
  // Split code by newlines into an array of strings
  var lines = code.split('\n');

  // Define regular expressions for different token types
  var tokenPatterns = [
    { type: 'NUMBER', pattern: /\b\d+\b/g },
    { type: 'BOOL', pattern: /\b(true|false)\b/g },
    { type: 'STRING', pattern: /(?:\"|\u201C)(?:[^\\\"]|\\.)*(?:\"|\u201D)/g },
    { type: 'LET', pattern: /\blet\b\s+([a-zA-Z_]\w*)/g },
    { type: 'PRIM2', pattern: /(\+|\-|\*|\/)/g },
    { type: 'VAR', pattern: /\b[a-zA-Z_]\w*\b/g },
    // Add more token types as needed
  ];

  // Special, reserved characters for plain tokens
  var specialChars = [
    '=', // For let expressions
    ';', // For separating statements
  ];

  // Tokenize each line
  var tokens = [];
  lines.forEach(function (line) {
    // Skip lines starting with '#' (comments)
    if (line.trim().startsWith('#')) {
      return;
    }
    var index = 0;

    while (index < line.length) {
      var foundMatch = false;

      tokenPatterns.forEach(function (tokenPattern) {
        tokenPattern.pattern.lastIndex = index;
        var match = tokenPattern.pattern.exec(line);

        if (match && match.index === index) {
          foundMatch = true;
          tokens.push({ type: tokenPattern.type, value: match[1] || match[0] });
          index += match[0].length;
        }
      });

      if (!foundMatch) {
        // If no match is found, add the character as a plain token
        var unknownToken = { type: 'UNKNOWN', value: line[index] };

        // Include only special characters in plain tokens
        if (specialChars.includes(unknownToken.value)) {
          tokens.push({ type: 'SPECIAL', value: unknownToken.value });
        }

        index++;
      }
    }
  });

  return tokens;
}
