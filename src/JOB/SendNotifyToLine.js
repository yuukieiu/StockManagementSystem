function sendLINE() {
    let messageText = "週次のストック集計が実行されました。\n"
    messageText = messageText + createNotifyMessage();

    // LINEから取得したトークン
    let token = PropertiesService.getScriptProperties().getProperty("LINE_MESSAGING_ACCESS_TOKEN");

    let url = "https://api.line.me/v2/bot/message/broadcast";
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'messages': [{
          'type': 'text',
          'text': messageText,
        }],
      }),
      });
   }

function createNotifyMessage() {
  let messageText = ""

  // メッセージ作成
  var today = new Date();
  messageText = messageText + "■" + today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " ストック閾値到達品一覧\n品名：ストック数\n";
  var notifyStocks = getNotifyStockList();
  // 分類でソート
  notifyStocks.sort(function(a,b) {
    if (a.Category > b.Category) return 1;
    if (a.Category < b.Category) return -1;
    if (a.LastUnsealDate > b.LastUnsealDate) return 1;
    if (a.LastUnsealDate < b.LastUnsealDate) return -1;
    return 0;
  })

  // 処理中の分類
  var currentCategory = "";

  // 処理中の最終開封日
  var currentLastUnsealDate = "";

  // 分類ヘッダー,最終開封日ヘッダーを入れつつ全件出力
  for (var i = 0; i < notifyStocks.length; i++) {
    if (currentCategory != notifyStocks[i].Category) {
      currentCategory = notifyStocks[i].Category;
      currentLastUnsealDate = "";
      messageText = messageText + "\n分類：" + currentCategory + "\n";
    }
    if (currentLastUnsealDate != notifyStocks[i].LastUnsealDate) {
      currentLastUnsealDate = notifyStocks[i].LastUnsealDate;
      messageText = messageText + "\n 最終開封日：" + currentLastUnsealDate + "\n";
    }
    messageText = messageText + "  " + notifyStocks[i].StockerName + "：" + notifyStocks[i].StockCount + "\n";
  }

  messageText = messageText + "以上"

  return messageText;
}