function sendLINE() {
    let messageText = ""
    messageText = createNotifyMessage();

    // LINEから取得したトークン
    //let token = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN_TEST"); // テスト用（1:1でじぶんに送る）
    let token = PropertiesService.getScriptProperties().getProperty("LINE_MESSAGING_ACCESS_TOKEN");
    let options = {
      "method" : "post",
      "headers" : {
        'Content-Type': 'application/json; charset=UTF-8',
        "Authorization" : "Bearer "+ token
      },
      "payload" : {
        'messages': [{
          'type': 'text',
          'text': messageText,
        }]
      }
    }

    let url = "https://api.line.me/v2/bot/message/broadcast";
    UrlFetchApp.fetch(url, options)
   }

function createNotifyMessage() {
  let messageText = ""

  // メッセージ作成
  var today = new Date();
  messageText = messageText + "■" + today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " ストック閾値到達品一覧\n品名：ストック数\n";
  var notifyStocks = getNotifyStockList();
  // 分類でソート
  notifyStocks.sort(function(a,b) {
    if (a.Category > b.Category) {
      return 1;
    } else {
      return -1;
    }
  })

  //処理中の分類
  var currentCategory = "";
  // 分類ヘッダーを入れつつ全件出力
  for (var i = 0; i < notifyStocks.length; i++) {
    if (currentCategory != notifyStocks[i].Category) {
      currentCategory = notifyStocks[i].Category;
      messageText = messageText + "\n分類：" + currentCategory + "\n";
    }
    messageText = messageText + "　" + notifyStocks[i].StockerName + "：" + notifyStocks[i].StockCount + "\n";
  }

  messageText = messageText + "以上"

  return messageText;
}