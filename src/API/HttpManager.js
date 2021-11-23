function doGet(e) {
    infoLog("GET受付", "GETリクエスト受信しました。");

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    var result;
    if (e.parameter.p1 == "getcat") {
      result = getCategoryList();
    } else if (e.parameter.p1 == "gethis") {
      result = getLastOperationHistory(e.parameter.p2);
    } else {
      result = getStockerList();
    }
    output.setContent(JSON.stringify(result));

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
        result = registerStocker(userData.email, jsonData.stocker.name, jsonData.stocker.count, jsonData.stocker.lastbuydate, jsonData.stocker.lastunsealdate, jsonData.stocker.notifythreshold, jsonData.stocker.category);
        break;
      case "push" :
        result = addStock(userData.email, jsonData.stocker.id, jsonData.stocker.count, jsonData.stocker.lastbuydate);
        break;
      case "pop" :
        result = useStock(userData.email, jsonData.stocker.id, jsonData.stocker.count, jsonData.stocker.lastunsealdate);
        break;
      case "delete" :
        result = deleteStocker(userData.email, jsonData.stocker.id);
        break;
      case "check" :
        try {
            result = checkStockCount(userData.email, jsonData.stocker.id)
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
        result = updateStocker(userData.email, jsonData.stocker.id, jsonData.stocker.newname, jsonData.stocker.newcategory, jsonData.stocker.newnotifythreshold);
        break;
      case "undo" :
        result = undoStockerOperation(jsonData.stocker.id, jsonData.stocker.operationid);
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