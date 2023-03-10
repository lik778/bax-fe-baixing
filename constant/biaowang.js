import { toOpt } from 'util/kit'

const _AUDIT_STATUS_REJECT_FROM_QUALITY_ROBOT = -11
const _AUDIT_STATUS_REJECT_FROM_QUALITY = -12
const _AUDIT_STATUS_REJECT_FROM_QUALITY_WITH_KEYWORD = -13
const _AUDIT_STATUS_REJECT_FROM_SEM = -14
const _AUDIT_STATUS_NOT_STARTED = 0
const _AUDIT_STATUS_PENDING_QUALITY = 10
const _AUDIT_STATUS_PASSED_QUALITY_ROBOT = 11
const _AUDIT_STATUS_PASSED_QUALITY = 12
const _AUDIT_STATUS_PASSED_SEM = 13

export const AUDIT_STATUS_PENDING_AUDIT = [_AUDIT_STATUS_NOT_STARTED]
export const AUDIT_STATUS_AUDITING = [_AUDIT_STATUS_PENDING_QUALITY, _AUDIT_STATUS_PASSED_QUALITY, _AUDIT_STATUS_PASSED_QUALITY_ROBOT]
export const AUDIT_STATUS_PASS = [_AUDIT_STATUS_PASSED_SEM]
export const AUDIT_STATUS_REJECT = [_AUDIT_STATUS_REJECT_FROM_QUALITY_ROBOT, _AUDIT_STATUS_REJECT_FROM_QUALITY, _AUDIT_STATUS_REJECT_FROM_QUALITY_WITH_KEYWORD, _AUDIT_STATUS_REJECT_FROM_SEM]

export const AUDIT_STATUS = {
  待审核: AUDIT_STATUS_PENDING_AUDIT,
  审核中: AUDIT_STATUS_AUDITING,
  审核通过: AUDIT_STATUS_PASS,
  审核驳回: AUDIT_STATUS_REJECT
}

export const auditStatusOpts = toOpt(AUDIT_STATUS, false, true)

const _PROMOTE_STATUS_FREEZED = -11
const _PROMOTE_STATUS_CREATED = 0
const _PROMOTE_STATUS_PENDING = 5
const _PROMOTE_STATUS_STARTED = 10
const _PROMOTE_STATUS_FINISHED = 50
export const _PROMOTE_STATUS_PAUSE = -10
const _PROMOTE_STATUS_MIGRATE = 100

export const PROMOTE_STATUS_PENDING_EDIT = [_PROMOTE_STATUS_CREATED]
export const PROMOTE_STATUS_PENDING_ONLINE = [_PROMOTE_STATUS_PENDING]
export const PROMOTE_STATUS_ONLINE = [_PROMOTE_STATUS_STARTED]
export const PROMOTE_STATUS_OFFLINE = [_PROMOTE_STATUS_FINISHED, _PROMOTE_STATUS_FREEZED]
export const PROMOTE_STATUS_PAUSE = [_PROMOTE_STATUS_PAUSE]
export const PROMOTE_STATUS_MIGRATE = [_PROMOTE_STATUS_MIGRATE]

export const PROMOTE_STATUS = {
  待设置: PROMOTE_STATUS_PENDING_EDIT,
  待投放: PROMOTE_STATUS_PENDING_ONLINE,
  投放中: PROMOTE_STATUS_ONLINE,
  已下线: PROMOTE_STATUS_OFFLINE,
  已暂停: PROMOTE_STATUS_PAUSE,
  已迁移: PROMOTE_STATUS_MIGRATE
}

export const promoteStatusOpts = toOpt(PROMOTE_STATUS, false, true)

export const DEVICE_ALL = 0
export const DEVICE_PC = 1
export const DEVICE_WAP = 2
export const DEVICE = {
  [DEVICE_ALL]: '全平台',
  [DEVICE_PC]: '电脑端',
  [DEVICE_WAP]: '手机端'
}

export const TRADER_TYPE = {
  TRADE_UNPAID: 0,
  TRADE_UNDELIVERED: 1,
  TRADE_DELIVERED: 2,
  TRADE_STOPPED: 30,
  TRADE_STARTED: 31,
  TRADE_MAX_NORMAL_STATUS: 49,
  TRADE_MIN_SUSPENDED_STATUS: 50,
  TRADE_MAX_SUSPENDED_STATUS: 99,
  TRADE_SUSPENDED_UNDELIVERED: 51,
  TRADE_SUSPENDED_DELIVERED: 52,
  TRADE_FINISHED: 100,
  TRADE_CANCELED: 101,
  TRADE_REFUNDED: 102
}

export const TRADE_STATUS = {
  [TRADER_TYPE.TRADE_UNPAID]: '未支付',
  [TRADER_TYPE.TRADE_UNDELIVERED]: '已支付，配送中',
  [TRADER_TYPE.TRADE_DELIVERED]: '送达',
  [TRADER_TYPE.TRADE_STOPPED]: '交易停止',
  [TRADER_TYPE.TRADE_STARTED]: '交易开始',
  [TRADER_TYPE.TRADE_MAX_NORMAL_STATUS]: '正常',
  [TRADER_TYPE.TRADE_MIN_SUSPENDED_STATUS]: '退款中',
  [TRADER_TYPE.TRADE_MAX_SUSPENDED_STATUS]: '退款中',
  [TRADER_TYPE.TRADE_SUSPENDED_UNDELIVERED]: '退款中',
  [TRADER_TYPE.TRADE_SUSPENDED_DELIVERED]: '退款中',
  [TRADER_TYPE.TRADE_FINISHED]: '已结束',
  [TRADER_TYPE.TRADE_CANCELED]: '已取消',
  [TRADER_TYPE.TRADE_REFUNDED]: '已退款'
}

export const PRICE_NEED_MANUAL_QUOTA = 10000 * 100 // 后台以分为单位
export const THIRTY_DAYS = 30
export const NINTY_DAYS = 90
export const HALF_YEAR_DAYS = 180
export const YEAR_DAYS = 360
export const DAYS_MAP = [THIRTY_DAYS, NINTY_DAYS]
export const GET_DAYS_MAP = function (soldType) {
  const isLongOrder = Number(soldType) === SOLD_TYPE_YEAR
  return isLongOrder ? DAYS_MAP.concat([HALF_YEAR_DAYS, YEAR_DAYS]) : DAYS_MAP
}

export const PROMOTE_OFFERED = 2
export const PROMOTE_UNOFFERED = 1
export const PROMOTE_OFFER_STATUS = {
  [PROMOTE_UNOFFERED]: '未报价',
  [PROMOTE_OFFERED]: '已报价'
}

export const ORDER_APPLY_TYPE_NOT = 0
export const ORDER_APPLY_TYPE_MONTH = 1
export const ORDER_APPLY_TYPE_YEAR = 2

export const APPLY_TYPE_MANUAL_PRICED = 1
export const APPLY_TYPE_ORDER_LONG = 2
export const APPLY_TYPES = {
  [APPLY_TYPE_MANUAL_PRICED]: '人工报价',
  [APPLY_TYPE_ORDER_LONG]: '申请长单'
}

export const SOLD_TYPE_MONTH = 1
export const SOLD_TYPE_YEAR = 2
export const SOLD_TYPES = {
  [SOLD_TYPE_MONTH]: '月单',
  [SOLD_TYPE_YEAR]: '年单'
}

export const NOT_SPECIALRENEW_LIST = [
  121856, 124167, 124283, 124284, 124285, 124479, 124480, 124562, 124563, 124564, 124565, 124614, 124615, 124616, 124638, 127089, 127090, 128842, 128843, 128844, 128845, 128846, 129150, 129151, 129152, 129153, 129154, 128881, 121988, 121992, 121993, 122054, 124082, 128882, 124170, 124171, 124193, 124194, 124195, 124196, 128883, 124682, 124683, 128884, 129301, 124481, 124482, 129347, 129348, 129349, 129350, 124566, 124567, 129300,
  118828, 118852, 119066, 119067, 120330, 120331, 120332, 120333, 120334, 120335, 120336, 120337, 121193, 121949, 122288, 122323, 122324, 122772, 122773, 123500, 123502, 124150, 124421, 124425, 124510, 124511, 124512, 125259, 125260, 125396, 125397, 125398, 125436, 125437, 125438, 125439, 125440, 125441, 125442, 125443, 125448, 125449, 125483, 125484, 125485, 125580, 125581, 125601, 125613, 125641, 125671, 125730, 125804, 125805, 125806, 125812, 125859, 125860, 125861, 125862, 125863, 125864, 125865, 125866, 125884, 125889, 125890, 125937, 125938, 125939, 125940, 126141, 126180, 126181, 126182, 126183, 126184, 126185, 126186, 126265, 126812, 127131, 127132, 127133, 127134, 128162, 128163, 128164, 128743, 128744, 128833, 128834, 129310, 129311, 129312, 129313, 129314, 129315, 129316, 129464, 129465, 129542, 129544, 129691, 129692, 129732, 129733, 129734, 129861, 129876, 129885, 129899, 129908, 129923, 129930, 129944, 129950, 129998, 130002, 130008, 130009, 130020, 130021, 130072, 130073, 130074, 130075, 130076, 130077, 130078, 130095, 130096, 130113, 130248, 130251, 130259, 130365, 130366, 130367, 130388, 130403, 130404, 130405, 130558, 130559, 130560, 130561, 130672,
  121940, 121941, 121942, 121943, 121944, 121945, 124483, 124484, 125475, 125476, 125477, 125478, 128387, 128612, 129255, 129256, 129257, 129258, 129320, 129379, 129380, 129381, 129382, 129383, 129446, 129447, 129539, 129624, 129625, 129626, 129627, 129628, 129629, 129630, 129631, 129632, 129633, 129634, 129635, 129636, 129637, 129638, 129639, 129640, 129641, 129642, 129643, 129644, 129645, 129695, 129696, 129889, 129906, 129909, 129947, 129948, 129949, 129953, 129997, 129999, 130000, 130001, 130003, 130004, 130005, 130006, 130007, 130071, 130146, 130147, 130153, 130183, 130184, 130186, 130265, 130266, 130267, 130273, 130308, 130319, 130422, 130423, 130424, 130425, 130426, 130427, 130438, 130439
]
