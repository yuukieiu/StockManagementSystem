//シート名を指定してシートを取得
function getSheetData() {
  var rows = Authentication.getDataRange().getValues();
  var keys = rows.splice(0, 1)[0];
  return rows.map(function(row) {
    var obj = {};
    row.map(function(item, index) {
      obj[String(keys[index])] = String(item);
    });
    return obj;
  });
}

//メールアドレスを指定してユーザーデータを返す
function getUserData(encryptedEmail) {
  var user_data = getSheetData();

  var user = user_data.filter(function(value) {
    return encryptedEmail == Utilities.base64EncodeWebSafe(value.email);
  });

  if (user[0] != undefined) {
    return user[0];
  }

  Logger.log('そのメールアドレスに対応するユーザーは存在しません。');
  return {status: 'ng'};
}
