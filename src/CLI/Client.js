const TARGET_URL = PropertiesService.getScriptProperties().getProperty("TARGET_URL");

const TARGET_URL_GETCATEGORY = TARGET_URL + "?p1=getcat";

const CLIENT_URL = ScriptApp.getService().getUrl();

const ACTIVE_USER = Session.getActiveUser().getEmail();

const ENCRYPTED_ACTIVE_USER = Utilities.base64EncodeWebSafe(Session.getActiveUser().getEmail());

const ENVIRONMENT = (PropertiesService.getScriptProperties().getProperty("ENVIRONMENT") == "STG") ? "[STG]" : "";

var list;

function getStockList() {
  var response = UrlFetchApp.fetch(TARGET_URL);
  var stockList = response.getContentText();
  var stockListJson = JSON.parse(JSON.stringify(stockList));
  return stockListJson.stockerList;
}

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('index');
  return t.evaluate()
        .setTitle('ストック管理クライアント')
        .addMetaTag('viewport', 'width=device-width,initial-scale=1,minimal-ui');
}