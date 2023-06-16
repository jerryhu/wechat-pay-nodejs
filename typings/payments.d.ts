
/**
 * 支付者信息
 */
export type TradePayer = {
    openid: string
}
/**
 * 订单金额信息
 */
export type TradeAmount = {
    total: number, // 总金额
    currency?: string // 货币类型
}
/**
 * 单品列表信息
 */
export type GoodsDetail = {
    merchant_goods_id: string, // 商户侧商品编码
    wechatpay_goods_id?: string, // 微信支付商品编码
    goods_name?: string, // 商品名称
    quantity: number, // 商品数量
    unit_price: number, // 商品单价
}

/**
 * 支付场景描述
 */
export type SceneInfo = {
    payer_client_ip: string, // 用户的客户端IP，支持IPv4和IPv6两种格式的IP地址
    device_id?: string, // 商户端设备号（门店号或收银设备ID）
    store_info?: StoreInfo; // 商户门店信息
}
/**
 * 商户门店信息
 */
export type StoreInfo = {
    id: string, // 商户侧门店编号
    name?: string, // 商户侧门店名称
    area_code?: string, // 地区编码
    address?: string, // 详细的商户门店地址
}
/**
 * 结算信息
 */
export type SettleInfo = {
    profit_sharing?: boolean // 是否指定分账
}
/**
 * 下单API参数
 */
export type PrepayParams = {
    description: string, // 商品描述
    out_trade_no: string, // 商户订单号
    time_expire?: string, // 交易结束时间
    attach?: string, // 附加数据
    notify_url: string, // 通知地址
    goods_tag?: string, // 订单优惠标记
    support_fapiao?: boolean, // 电子发票入口开放标识
    amount: TradeAmount, // 订单金额
    detail?: {
        cost_price?: number,
        invoice_id?: string,
        goods_detail?: GoodsDetail[],
    }, // 优惠功能
    scene_info?: SceneInfo, // 场景信息
    settle_info?: SettleInfo, // 结算信息
}

/**
 * JSAPI下单参数
 */
export type PrepayJsApiParams = PrepayParams & { 
    payer: TradePayer, // 支付者信息
}


/**
 * H5下单参数
 */
export type PrepayH5Params = PrepayParams & { 
    scene_info: SceneInfo & {
        h5_info: {
            type: string, // 场景类型 (示例值：iOS, Android, Wap)
            app_name?: string, // 应用名称
            app_url?: string, // 网站URL
            bundle_id?: string, // iOS平台BundleID
            package_name?: string, // Android平台PackageName
        }
    }, // 场景信息
}

/**
 * JSAPI下单参数 - 服务商
 */
export type PrepayJsApiPartnerParams = PrepayParams & {
    sub_mchid: string, // 子商户号
    sub_appid?: string, // 子商户应用ID
    payer: {
        sp_openid?: string, // 用户服务标识 (用户在服务商appid下的唯一标识)
        sub_openid?: string, // 用户子标识 (用户在子商户appid下的唯一标识。若传sub_openid，那sub_appid必填)
    }, // 支付者信息 (二选一)
}

/**
 * APP下单参数 - 服务商
 */
export type PrepayAppPartnerParams = PrepayParams & {
    sub_mchid: string, // 子商户号
    sub_appid?: string, // 子商户应用ID
}

/**
 * H5下单参数 - 服务商
 */
export type PrepayH5PartnerParams = PrepayH5Params & {
    sub_mchid: string, // 子商户号
    sub_appid?: string, // 子商户应用ID
}

/**
 * Native下单参数 - 服务商
 */
export type PrepayNativePartnerParams = PrepayParams & {
    sub_mchid: string, // 子商户号
    sub_appid?: string, // 子商户应用ID
}

/**
 * 下单API返回结果
 */
export type PrepayResult = {
    prepay_id: string, // 预支付交易会话标识。用于后续接口调用中使用，该值有效期为2小时
}

/**
 * JSAPI下单返回结果
 */
export type PrepayJsapiResult = {
    appId: string, // 公众号对应的appid / 小程序ID
    timeStamp: string, // 时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数。注意：部分系统取到的值为毫秒级，需要转换成秒(10位数字)
    nonceStr: string, // 随机字符串
    package: string, // 订单详情扩展字符串 (小程序下单接口返回的prepay_id参数值，提交格式如：prepay_id=***)
    signType: string, // 签名类型，默认为RSA，仅支持RSA
    paySign: string, // 签名，使用字段appId、timeStamp、nonceStr、package计算得出的签名值
}

/**
 * APP下单返回结果
 */
export type PrepayAppResult = {
    appid: string, // 应用ID (微信开放平台审核通过的移动应用appid)
    partnerid: string, // 商户号 (商户号mchid对应的值)
    prepayid: string, // 预支付交易会话ID
    package: string, // 订单详情扩展字符串 (暂填写固定值Sign=WXPay)
    noncestr: string, // 随机字符串
    timestamp: string, // 时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数。注意：部分系统取到的值为毫秒级，需要转换成秒(10位数字)
    sign: string, // 签名，使用字段appId、timeStamp、nonceStr、package计算得出的签名值
}

/**
 * H5下单返回结果
 */
export type PrepayH5Result = {
    h5_url: string, // 支付跳转链接 (h5_url为拉起微信支付收银台的中间页面，可通过访问该url来拉起微信客户端，完成支付，h5_url的有效期为5分钟)
}

/**
 * Native下单返回结果
 */
export type PrepayNativeResult = {
    code_url: string, // 二维码链接 (此URL用于生成支付二维码，然后提供给用户扫码支付)
}

/**
 * 订单查询结果
 */
export type QueryOrderResultBase = {
    // appid: string, // 应用ID
    // mchid: string, // 直连商户号
    out_trade_no: string, // 商户订单号
    transaction_id: string, // 微信支付订单号
    trade_type: string, // 交易类型
    bank_type: string, // 付款银行
    attach: string, // 附加数据
    success_time: string, // 支付完成时间
    amount: TradeAmount & {
        payer_total?: number, // 用户支付金额
        payer_currency?: string, // 用户支付币种
    }, // 订单金额
    scene_info?: {
        device_id: string, // 商户端设备号
    }, // 场景信息
    promotion_detail?: {
        coupon_id: string, // 券ID
        name?: string, // 优惠名称
        scope?: string, // 优惠范围
        type?: string, // 优惠类型
        amount: number, // 优惠券面额
        stock_id?: string, // 活动ID
        wechatpay_contribute?: number, // 微信出资
        merchant_contribute?: number, // 商户出资
        other_contribute?: number, // 其他出资
        currency?: string, // 优惠币种
        goods_detail?: {
            goods_id: string, // 商品编码
            quantity: number, // 商品数量
            unit_price: number, // 商品单价
            discount_amount: number, // 商品优惠金额
            goods_remark?: string, // 商品备注
        }[], // 单品列表信息
    }[], // 优惠功能，享受优惠时返回该字段
}

/**
 * 查询订单结果 - 直连商户
 */
export type QueryOrderResult = QueryOrderResultBase & {
    appid: string, // 应用ID
    mchid: string, // 直连商户号
    payer: TradePayer, // 支付者信息
}

/**
 * 查询订单结果 - 服务商
 */
export type QueryOrderPartnerResult = QueryOrderResultBase & {
    sp_appid: string, // 服务商应用ID
    sp_mchid: string, // 服务商户号
    sub_appid?: string, // 子商户应用ID
    sub_mchid: string, // 子商户号
    payer: {
        sp_openid: string, // 用户服务标识 (用户在服务商appid下的唯一标识)
        sub_openid?: string, // 用户子标识 (用户在子商户appid下的唯一标识。如果返回sub_appid，那么sub_openid一定会返回)
    }, // 支付者信息
}

/**
 * 支付成功通知参数
 */
export type WechatPayNotifyDataBase = {
  out_trade_no: string, // 商户订单号
  transaction_id: string, // 微信支付订单号
  trade_type: string, // 交易类型
  trade_state: string, // 交易状态
  trade_state_desc: string, // 交易状态描述
  bank_type: string, // 付款银行
  attach?: string, // 附加数据
  success_time: string, // 支付完成时间
  amount: { // 订单金额信息
    total: number, // 总金额
    payer_total: number, // 用户支付金额
    currency: string, // 货币类型
    payer_currency: string, // 用户支付币种
  },
  scene_info?: { // 场景信息
    device_id: string, // 商户端设备号
  }
  promotion_detail?: { // 优惠功能，享受优惠时返回该字段
    coupon_id: string, // 券ID
    name?: string, // 优惠名称
    scope?: string, // 优惠范围
    type?: string, // 优惠类型
    amount: number, // 优惠券面额
    stock_id?: string, // 活动ID
    wechatpay_contribute?: number, // 微信出资
    merchant_contribute?: number, // 商户出资
    other_contribute?: number, // 其他出资
    currency?: string, // 优惠币种
    goods_detail?: { // 单品列表信息
      goods_id: string, // 商品编码
      quantity: number, // 商品数量
      unit_price: number, // 商品单价
      discount_amount: number, // 商品优惠金额
      goods_remark?: string, // 商品备注
    }[] 
  }[]
}

/**
 * 支付成功通知参数 - 直连商户
 */
export type WechatPayNotifyData = WechatPayNotifyDataBase & {
    appid: string, // 应用ID
    mchid: string, // 商户号
    payer: { // 支付者
        openid: string, // 用户标识
    },
}

/**
 * 支付成功通知参数 - 服务商
 */
export type WechatPayNotifyPartnerData = WechatPayNotifyDataBase & {
    sp_appid: string, // 服务商应用ID
    sp_mchid: string, // 服务商户号
    sub_appid?: string, // 子商户应用ID
    sub_mchid: string, // 子商户号
    payer: {
        sp_openid: string, // 用户服务标识 (用户在服务商appid下的唯一标识)
        sub_openid?: string, // 用户子标识 (用户在子商户appid下的唯一标识。如果返回sub_appid，那么sub_openid一定会返回)
    }, // 支付者信息
}

//#region 退款
/**
 * 订单退款金额信息
 */
export type RefundAmount = {
    refund: number, // 退款金额，单位为分，只能为整数，不能超过原订单支付金额
    from?: {
        account: string, // 出资账户类型 (枚举值：AVAILABLE : 可用余额 UNAVAILABLE : 不可用余额)
        amount: number, // 出资金额 (对应账户出资金额)
    }[], // 退款出资账户及金额
    total: number // 原订单金额 (原支付交易的订单总金额，单位为分，只能为整数)
    currency: string, // 退款币种 (符合ISO 4217标准的三位字母代码，目前只支持人民币：CNY)
}
/**
 * 退款商品信息
 */
export type RefundGoodsDetail = {
    merchant_goods_id: string, // 商户侧商品编码
    wechatpay_goods_id?: string, // 微信支付商品编码
    goods_name?: string, // 商品名称
    unit_price: number, // 商品单价
    refund_amount: number, // 商品退款金额
    refund_quantity: number, // 商品退货数量
}
/**
 * 申请退款参数
 */
export type CreateRefundParams = {
    transaction_id?: string,  // 微信支付订单号 (原支付交易对应的微信订单号)
    out_trade_no?: string, // 商户订单号 (原支付交易对应的商户订单号)
    out_refund_no: string, // 商户退款单号 (商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔)
    reason?: string, // 退款原因
    notify_url?: string, // 退款结果回调url
    funds_account?: string, // 退款资金来源
    amount: RefundAmount, // 金额信息
    goods_detail?: RefundGoodsDetail[], //  退款商品
}

/**
 * 申请退款参数 - 服务商
 */
export type CreateRefundPartnerParams = CreateRefundParams & {
    sub_mchid: string, // 子商户号
}

/**
 * 退款信息
 */
export type RefundInfo = {
    refund_id: string, // 微信支付退款单号
    out_refund_no: string, // 商户退款单号 (商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔)
    transaction_id: string, // 微信支付订单号
    out_trade_no: string, // 商户订单号 (原支付交易对应的商户订单号)
    channel: string, // 退款渠道
    user_received_account: string, // 退款入账账户
    success_time: string, // 退款成功时间
    create_time: string, // 退款创建时间
    status: string, // 退款状态
    funds_account: string, // 资金账户
    amount: RefundAmount & {
        payer_total: number, // 用户支付金额 (现金支付金额，单位为分，只能为整数)
        payer_refund: number, // 用户退款金额 (退款给用户的金额，不包含所有优惠券金额)
        settlement_refund: number, // 应结退款金额 (去掉非充值代金券退款金额后的退款金额，单位为分，退款金额=申请退款金额-非充值代金券退款金额，退款金额<=申请退款金额)
        settlement_total: number, // 应结订单金额 (应结订单金额=订单金额-免充值代金券金额，应结订单金额<=订单金额，单位为分)
        discount_refund: number, // 优惠退款金额 (优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为现金，说明详见代金券或立减优惠，单位为分)
        refund_fee?: number, // 手续费退款金额
    }, // 金额详细信息
    promotion_detail?: {
        promotion_id: string, // 券ID (券或者立减优惠id)
        scope: string, // 优惠范围
        type: string, // 优惠类型
        amount: number, // 优惠券面额
        refund_amount: number, // 优惠退款金额
        goods_detail?: RefundGoodsDetail[], // 优惠商品发生退款时返回商品信息
    }[], // 优惠退款信息
}
//#endregion

//#region 账单
/**
 * 申请交易账单参数
 */
export interface TradeBillParams {
    bill_date: string, // 账单日期 (格式yyyy-MM-dd 仅支持三个月内的账单下载申请)
    bill_type?: string, // 账单类型 (枚举值 ALL/SUCCESS/REFUND，默认 ALL)
    tar_type?: string, // 压缩类型 (不填则默认是数据流。 GZIP：返回格式为.gzip的压缩包账单)
}

/**
 * 申请交易账单参数 - 服务商
 */
export interface TradeBillPartnerParams {
    bill_date: string, // 账单日期 (格式yyyy-MM-dd 仅支持三个月内的账单下载申请)
    sub_mchid?: string, // 子商户号 (商户是服务商：● 不填则默认返回服务商下的交易或退款数据。● 如需下载某个子商户下的交易或退款数据，则该字段必填)
    bill_type?: string, // 账单类型 (枚举值 ALL/SUCCESS/REFUND，默认 ALL)
    tar_type?: string, // 压缩类型 (不填则默认是数据流。 GZIP：返回格式为.gzip的压缩包账单)
}

/**
 * 申请资金账单参数
 */
export interface FundFlowBillParams {
    bill_date: string, // 账单日期 (格式yyyy-MM-dd 仅支持三个月内的账单下载申请)
    account_type?: string, // 资金账户类型 (枚举值 BASIC/OPERATION/FEES，默认 BASIC)
    tar_type?: string, // 压缩类型 (不填则默认是数据流。 GZIP：返回格式为.gzip的压缩包账单)
}

/**
 * 申请单个子商户资金账单参数
 */
export interface SubMerchantFundFlowBillParams {
    sub_mchid: string, // 子商户号
    bill_date: string, // 账单日期 (格式yyyy-MM-dd)
    account_type: string, // 资金账户类型 (枚举值 BASIC/OPERATION/FEES)
    algorithm: string, // 加密算法 (枚举值: AEAD_AES_256_GCM/SM4_GCM)
    tar_type?: string, // 压缩类型 (不填则默认是数据流。 GZIP：返回格式为.gzip的压缩包账单)
}

/**
 * 申请交易账单结果
 */
export interface BillResult {
    hash_type: string, // 哈希类型 (SHA1)
    hash_value: string, // 哈希值 (原始账单（gzip需要解压缩）的摘要值，用于校验文件的完整性)
    download_url: string, // 账单下载地址 (供下一步请求账单文件的下载地址，该地址30s内有效)
}

/**
 * 申请单个子商户资金账单结果
 */
export interface SubMerchantBillResult {
    download_bill_count: number, // 下载信息总数
    download_bill_list: {
        bill_sequence: number, // 账单文件序号 (商户将多个文件按账单文件序号的顺序合并为完整的资金账单文件，起始值为1)
        download_url: string, // 下载地址 (下载地址30s内有效)
        encrypt_key: string, // 加密密钥
        hash_type: string, // 哈希类型 (SHA1)
        hash_value: string, // 哈希值 (原始账单（gzip需要解压缩）的摘要值，用于校验文件的完整性)
        nonce: string, // 随机字符串 (加密账单文件使用的随机字符串)
    }[], // 下载信息明细
}

//#endregion