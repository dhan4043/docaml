function highlightAndLint() {
  // Get the active Google Doc
  var doc = DocumentApp.getActiveDocument();

  // Get the body of the document
  var body = doc.getBody();

  // Get the paragraphs in the body
  var paragraphs = body.getParagraphs();

  // Define colors for different token types
  var tokenColors = {
    'LET': '#61afef',    // Blue
    'NUMBER': '#98c379', // Green
    'BOOL': '#56b6c2',   // Cyan
    'STRING': '#e06c75',  // Red
    'COMMENT': '#6c757d' // Grey
  };

  // Define regular expressions for different token types
  var tokenPatterns = [
    { type: 'LET', pattern: /\b(let)\b/g },
    { type: 'NUMBER', pattern: /\b\d+\b/g },
    { type: 'BOOL', pattern: /\b(true|false)\b/g },
    { type: 'STRING', pattern: /(?:\"|\u201C)(?:[^\"\\]|\\.)*(?:\"|\u201D)/g },
    { type: 'COMMENT', pattern: /^#.*$/gm }
  ];

  // Highlight and lint each paragraph
  paragraphs.forEach(function (paragraph) {
    var text = paragraph.getText();

    // Process tokens for highlighting
    tokenPatterns.forEach(function (tokenPattern) {
      var match;
      while ((match = tokenPattern.pattern.exec(text)) !== null) {
        var start = match.index;
        var end = match.index + match[0].length - 1;
        paragraph.editAsText().setAttributes(start, end, { [DocumentApp.Attribute.FOREGROUND_COLOR]: tokenColors[tokenPattern.type] });
      }
    });
  });
}
