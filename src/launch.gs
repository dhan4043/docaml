function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem("VSDocs", "showSidebar")
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService
    .createTemplateFromFile('ui')
    .evaluate()
    .setTitle("VSDocs");
  DocumentApp.getUi().showSidebar(ui);
}

var include = function (filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};
