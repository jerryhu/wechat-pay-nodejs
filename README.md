# 微信支付 APIv3 NodeJS SDK
[微信支付 APIv3](https://wechatpay-api.gitbook.io/wechatpay-api-v3/) 非官方 Node.js 语言开发库。
支持 [直连商户](https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml) 和 [服务商接口](https://pay.weixin.qq.com/wiki/doc/apiv3_partner/index.shtml)


## 安装
```
npm install wechat-pay-nodejs
```

## 使用示例

### 对象实例化 - 直连商户
```typescript
import { WechatPay } from "wechat-pay-nodejs";

const wechatPay = new WechatPay({
    appid: '{appid}', // 应用ID
    mchid: '{mchid}', // 直连商户号
    cert_private_content: Buffer.from('{apiclient_key.pem}'), // 商户API私钥内容
    cert_public_content: Buffer.from('{apiclient_cert.pem}'), // 商户API证书内容
    user_agent: '{User-Agent}', // 选填
})
```

### 对象实例化 - 服务商
```typescript
import { WechatPayPartner } from "wechat-pay-nodejs";

const wechatPayPartner = new WechatPayPartner({
    appid: '{sp_appid}', // 服务商应用ID
    mchid: '{sp_mchid}', // 服务商户号
    cert_private_content: Buffer.from('{apiclient_key.pem}'), // 服务商API私钥内容
    cert_public_content: Buffer.from('{apiclient_cert.pem}'), // 服务商API证书内容
    user_agent: '{User-Agent}', // 选填
})
```

### 接口调用 - 服务商JSAPI下单
```typescript
import { PrepayJsApiPartnerParams } from "wechat-pay-nodejs/typings";

const params : PrepayJsApiPartnerParams = {
    sub_mchid: '{sub_mchid}', // 子商户号
    description: '{description}', // 商品描述
    out_trade_no: '{out_trade_no}', // 商户订单号
    notify_url: '{notify_url}', // 通知地址
    amount: {
    total: 100, // 订单金额
    },
    payer: {
    sp_openid: '{sp_openid}', // 用户服务标识
    }
};

const result = await wechatPayPartner.prepayJsapi(params);
```

### 签名验证
```typescript
import { VerifyParams } from "wechat-pay-nodejs/typings";

const headers = '{HTTP Headers}';
const timestamp = headers['wechatpay-timestamp'];
const nonce = headers['wechatpay-nonce'];
const serialNumber = headers['wechatpay-serial'];
const signature = headers['wechatpay-signature'];
const certificates = '{certificates}'; // 微信平台证书列表 (调用getCertificates接口获取，建议缓存10小时)
const verifyParams : VerifyParams = {
    timestamp: timestamp, // HTTP头Wechatpay-Timestamp 中的应答时间戳
    nonce: nonce, // HTTP头Wechatpay-Nonce 中的应答随机串
    body: '{body}', // 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败
    serialNumber: serialNumber, // HTTP头Wechatpay-Serial 证书序列号
    signature: signature, // HTTP头Wechatpay-Signature 签名
    apiSecret: '{api_v3_key}', // APIv3密钥
    certificates: certificates, // 微信证书列表
}
const result = wechatPay.verify(verifyParams);
```

### 回调报文解密
```typescript
const decryptedDataText = wechatPay.decryptAesGcm({
    ciphertext: '{resource.ciphertext}', // 密文 
    associatedData: '{resource.associated_data}', // 附加数据
    nonce: '{resource.nonce}', // 随机串
    apiV3Key: '{api_v3_ke}', // APIv3密钥
})
```

## 目前已实现的接口

### 直连商户

| 分类   | 接口名称              | 函数名                      |
| ---- | ----------------- | ------------------------ |
| 基础支付 | JSAPI下单           | prepayJsapi              |
| 基础支付 | H5下单API           | prepayH5                 |
| 基础支付 | APP下单API          | prepayApp                |
| 基础支付 | Native下单API       | prepayNative             |
| 基础支付 | 微信支付订单号查询订单       | queryOrderById           |
| 基础支付 | 商户订单号查询订单         | queryOrderByOutTradeNo   |
| 基础支付 | 关闭订单API           | closeOrder               |
| 基础支付 | 申请退款API           | createRefund             |
| 基础支付 | 查询单笔退款API         | queryRefundByOutRefundNo |
| 基础支付 | 申请交易账单API         | tradeBill                |
| 基础支付 | 申请资金账单API         | fundFlowBill             |
| 基础支付 | 下载账单API           | downloadBill             |
| 其他能力 | 微信支付平台证书 - 获取平台证书 | getCertificates          |

### 服务商

| 分类   | 接口名称              | 函数名                      |
| ---- | ----------------- | ------------------------ |
| 基础支付 | JSAPI下单           | prepayJsapi              |
| 基础支付 | H5下单API           | prepayH5                 |
| 基础支付 | APP下单API          | prepayApp                |
| 基础支付 | Native下单API       | prepayNative             |
| 基础支付 | 微信支付订单号查询订单       | queryOrderById           |
| 基础支付 | 商户订单号查询订单         | queryOrderByOutTradeNo   |
| 基础支付 | 关闭订单API           | closeOrder               |
| 基础支付 | 申请退款API           | createRefund             |
| 基础支付 | 查询单笔退款API         | queryRefundByOutRefundNo |
| 基础支付 | 申请交易账单API         | tradeBill                |
| 基础支付 | 申请资金账单API         | fundFlowBill             |
| 基础支付 | 下载账单API           | downloadBill             |
| 基础支付 | 申请单个子商户资金账单       | subMerchantFundFlowBill  |
| 其他能力 | 微信支付平台证书 - 获取平台证书 | getCertificates          |


## 未实现的接口
* 部分未实现的接口，可以调用SDK中的**callApi**方法来实现。具体参考以下示例
```typescript
import { objToQueryString } from "wechat-pay-nodejs/lib/utils";

/**
 * 分账结果
 */
type QueryProfitSharingOrderResult = {
    transaction_id: string, // 微信订单号
    out_order_no: string, // 商户分账单号
    order_id: string, // 微信分账单号
    state: string, // 分账单状态
    receivers: {
        amount: number, // 分账金额
        description: string, // 分账描述
        type: string, // 分账接收方类型
        account: string, // 分账接收方账号
        result: string, // 分账结果
        fail_reason: string, // 分账失败原因
        detail_id: string, // 分账明细单号
        create_time: string, // 分账创建时间
        finish_time: string, // 分账完成时间
    }[], // 分账接收方列表
}

/**
 * 查询分账结果API
 * @param transactionId 微信订单号
 * @param outOrderNo 商户分账单号
 */
async queryProfitSharingOrder(transactionId: string, outOrderNo: string) : Promise<BaseResponse<QueryProfitSharingOrderResult>>{
    let apiUrl = `/v3/profitsharing/orders/${outOrderNo}`;

    const params = {
        transaction_id: transactionId
    }

    apiUrl = apiUrl + objToQueryString(params)

    // 接口请求
    const result = await wechatPay.callApi<QueryProfitSharingOrderResult>({ 
        method: HttpMethod.GET, 
        apiUrl
    })
}
```
* 欢迎大家通过Pull Request一起完善接口

## 修改日志
[查看修改日志](https://github.com/jerryhu/wechat-pay-nodejs/blob/main/CHANGELOG.md)