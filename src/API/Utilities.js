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
      case OPERATION_TIMESTAMP:
        return DISP_OPERATION_TIMESTAMP;
      case OPERATION_USER:
        return DISP_OPERATION_USER;
      case OPERATION_FUNCTION:
        return DISP_OPERATION_FUNCTION;
      case OPERATION_STOCKER_NAME:
        return DISP_OPERATION_STOCKER_NAME;
      case OPERATION_STOCKER_COUNT:
        return DISP_OPERATION_STOCKER_COUNT;
      case OPERATION_NOTIFY_THRESHOLD:
        return DISP_OPERATION_NOTIFY_THRESHOLD;
      case OPERATION_CATEGORY:
        return DISP_OPERATION_CATEGORY;
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
        return COLNUM_CATEGORY;
      case OPERATION_TIMESTAMP:
        return COLNUM_OPERATION_TIMESTAMP;
      case OPERATION_USER:
        return COLNUM_OPERATION_USER;
      case OPERATION_FUNCTION:
        return COLNUM_OPERATION_FUNCTION;
      case OPERATION_STOCKER_NAME:
        return COLNUM_OPERATION_STOCKER_NAME;
      case OPERATION_STOCKER_COUNT:
        return COLNUM_OPERATION_STOCKER_COUNT;
      case OPERATION_NOTIFY_THRESHOLD:
        return COLNUM_OPERATION_NOTIFY_THRESHOLD;
      case OPERATION_CATEGORY:
        return COLNUM_OPERATION_CATEGORY;
      default:
        return 0;
    }
  }