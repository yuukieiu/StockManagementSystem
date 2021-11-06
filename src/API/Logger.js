// 開始メッセージ
const START_LOG_MESSAGE = "処理開始";

// 終了メッセージ
const END_LOG_MESSAGE = "処理終了";

// ------------------------
// infoログ出力
// ------------------------
function infoLog(functionName, message) {
  console.info("【" + functionName + "】" + message);
}

// ------------------------
// warnログ出力
// ------------------------
function warnLog(functionName, message) {
  console.warn("【" + functionName + "】", message);
}

// ------------------------
// errorログ出力
// ------------------------
function errorLog(functionName, message) {
  console.error("【" + functionName + "】", message);
}

// ------------------------
// 開始ログ出力
// ------------------------
function writeStartLog(functionName) {
  infoLog(functionName, START_LOG_MESSAGE);
}

// ------------------------
// 終了ログ出力
// ------------------------
function writeEndLog(functionName) {
  infoLog(functionName, END_LOG_MESSAGE);
}