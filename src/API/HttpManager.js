function doGet(e) {
    infoLog("GET受付", "GETリクエスト受信しました。");

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    var result;
    if (e.parameter.p1 == "getcat") {
      result = getCategoryList();
    } else {
      result = getStockerList();
    }
    output.setContent(JSON.stringify(result));

    //return HtmlService.createTemplateFromFile('index').evaluate();
    return output;
  }

  function doPost(e) {
    var jsonString = e.postData.getDataAsString();
    var jsonData = JSON.parse(jsonString);

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // メールアドレスチェック
    var userData = getUserData(jsonData.encryptedEmail);
    if (userData.status != "ok") {
      output.setContent(JSON.stringify({ message: "failure..." }));
      return output
    }

    infoLog("POST受付", "POSTリクエスト受信しました。");
    infoLog("POST受付", "受信JSON：" + jsonString);

    var result;

    switch (jsonData.method) {
      case "create" :
        result = registerStocker(jsonData.stocker.name, jsonData.stocker.count, jsonData.stocker.lastbuydate, jsonData.stocker.lastunsealdate, jsonData.stocker.notifythreshold, jsonData.stocker.category);
        break;
      case "push" :
        result = addStock(jsonData.stocker.id, jsonData.stocker.count);
        break;
      case "pop" :
        result = useStock(jsonData.stocker.id, jsonData.stocker.count);
        break;
      case "delete" :
        result = deleteStocker(jsonData.stocker.id);
        break;
      case "check" :
        try {
            result = checkStockCount(jsonData.stocker.id)
        } catch (e) {
            switch(e.message) {
                case CANT_CHECK_STOCK_COUNT_EXCEPTION:
                default:
                    // Nothing To Do !!
                    break;
            }
        }
        break;
      case "edit" :
        result = updateStocker(jsonData.stocker.id, jsonData.stocker.newname, jsonData.stocker.newcategory, jsonData.stocker.newnotifythreshold);
        break;
      default:
        break;
    }

    if (result.status) {
      output.setContent(JSON.stringify({ message: result.message }));
    } else {
      output.setContent(JSON.stringify({ message: "failure..." + result.message }));
    }

    return output;
  }