// ------------------------
// 表示名取得
// ------------------------
function GetDisplayItemName(itemName) {
    switch (itemName) {
      case STOCKER_ID:
        return DISP_STOCKER_ID;
      case STOCKER_NAME:
        return DISP_STOCKER_NAME;
      case STOCKER_COUNT:
        return DISP_STOCKER_COUNT;
      case LAST_BUY_DATE:
        return DISP_LAST_BUY_DATE;
      case LAST_UNSEAL_DATE:
        return DISP_LAST_UNSEAL_DATE;
      case NOTIFY_THRESHOLD:
        return DISP_NOTIFY_THRESHOLD;
      case CATEGORY:
        return DISP_CATEGORY;
      default:
        return "";
    }
  }

  // ------------------------
  // 列番号取得
  // ------------------------
  function GetItemColumnNum(itemName) {
    switch (itemName) {
      case STOCKER_ID:
        return COLNUM_STOCKER_ID;
      case STOCKER_NAME:
        return COLNUM_STOCKER_NAME;
      case STOCKER_COUNT:
        return COLNUM_STOCKER_COUNT;
      case LAST_BUY_DATE:
        return COLNUM_LAST_BUY_DATE;
      case LAST_UNSEAL_DATE:
        return COLNUM_LAST_UNSEAL_DATE;
      case NOTIFY_THRESHOLD:
        return COLNUM_NOTIFY_THRESHOLD;
      case CATEGORY:
        return COLUMN_CATEGORY;
      default:
        return 0;
    }
  }