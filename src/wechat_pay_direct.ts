import { ApiResult, HttpMethod } from "../typings";
import { CreateRefundParams, FundFlowBillParams, PrepayAppResult, PrepayH5Params, PrepayH5Result, PrepayJsApiParams, PrepayJsapiResult, PrepayNativeResult, PrepayParams, PrepayResult, QueryOrderResult, RefundInfo, TradeBillParams, BillResult } from "../typings/payments";
import { currentTimestamp, generateNonce, objToQueryString } from "./utils";
import WechatPayBase from "./wechat_pay_base";

/**
 * 直连商户接口
 */
class WechatPayDirect extends WechatPayBase {
  //#region 基础支付

  /**
   * JSAPI支付下单
   * @param params 参数
   */
  public async prepayJsapi(params: PrepayJsApiParams): Promise<ApiResult<PrepayJsapiResult>>{
    // 请求参数
    const body = {
      appid: this.appid,
      mchid: this.mchid,
      ...params,
    };
    const apiUrl = '/v3/pay/transactions/jsapi';
  
    // 接口请求
    const result = await this.callApi<PrepayResult>({ method: HttpMethod.POST, apiUrl, body});
    if(result.success && result.data && result.data.prepay_id){
      //#region 准备JSAPI/小程序调起支付所需的数据
      const prepayData : PrepayJsapiResult = {
        appId: this.appid, // 公众号对应的appid / 小程序ID
        timeStamp: currentTimestamp(), // 时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数。注意：部分系统取到的值为毫秒级，需要转换成秒(10位数字)
        nonceStr: generateNonce(), // 随机字符串
        package: `prepay_id=${result.data.prepay_id}`, // 订单详情扩展字符串 (小程序下单接口返回的prepay_id参数值，提交格式如：prepay_id=***)
        signType: 'RSA', // 签名类型，默认为RSA，仅支持RSA
        paySign: '', // 签名，使用字段appId、timeStamp、nonceStr、package计算得出的签名值
      }
      const strToSign = [prepayData.appId, prepayData.timeStamp, prepayData.nonceStr, prepayData.package, ''].join('\n')
      prepayData.paySign = this.sign(strToSign);
      //#endregion
      
      return { success:true, data: prepayData }
    }
    return { success: false, errCode: result.errCode, errMsg: result.errMsg}
  }

  /**
   * APP支付下单
   * @param params 参数
   */
  public async prepayApp(params: PrepayParams): Promise<ApiResult<PrepayAppResult>>{
    // 请求参数
    const body = {
      appid: this.appid,
      mchid: this.mchid,
      ...params,
    };
    const apiUrl = '/v3/pay/transactions/app';
  
    // 接口请求
    const result = await this.callApi<PrepayResult>({ method: HttpMethod.POST, apiUrl, body });
    if(result.success && result.data && result.data.prepay_id){
      //#region 准备APP调起支付调起支付所需的数据
      const prepayData : PrepayAppResult = {
        appid: this.appid, // 应用ID (微信开放平台审核通过的移动应用appid)
        partnerid: this.mchid, // 商户号 (商户号mchid对应的值)
        prepayid: result.data.prepay_id, // 预支付交易会话ID
        package: 'Sign=WXPay', // 订单详情扩展字符串 (暂填写固定值Sign=WXPay)
        noncestr: generateNonce(), // 随机字符串
        timestamp: currentTimestamp(), // 时间戳，标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数。注意：部分系统取到的值为毫秒级，需要转换成秒(10位数字)
        sign: '', // 签名，使用字段appId、timeStamp、nonceStr、package计算得出的签名值
      }
      const strToSign = [prepayData.appid, prepayData.timestamp, prepayData.noncestr, prepayData.partnerid, ''].join('\n')
      prepayData.sign = this.sign(strToSign);
      //#endregion
      
      return { success:true, data: prepayData }
    }
    return { success: false, errCode: result.errCode, errMsg: result.errMsg}
  }

  /**
   * H5支付下单
   * @param params 参数
   */
  public async prepayH5(params: PrepayH5Params): Promise<ApiResult<PrepayH5Result>>{
    // 请求参数
    const body = {
      appid: this.appid,
      mchid: this.mchid,
      ...params,
    };
    const apiUrl = '/v3/pay/transactions/h5';
  
    // 接口请求
    const result = await this.callApi<PrepayH5Result>({ method: HttpMethod.POST, apiUrl, body });
    if(result.success && result.data && result.data.h5_url){
      return result
    }
    return { success: false, errCode: result.errCode, errMsg: result.errMsg}
  }

  /**
   * Native支付预下单
   * @param params 参数
   */
  public async prepayNative(params: PrepayParams): Promise<ApiResult<PrepayNativeResult>>{
    // 请求参数
    const body = {
      appid: this.appid,
      mchid: this.mchid,
      ...params,
    };
    const apiUrl = '/v3/pay/transactions/native';
  
    // 接口请求
    const result = await this.callApi<PrepayNativeResult>({ method: HttpMethod.POST, apiUrl, body });
    if(result.success && result.data && result.data.code_url){
      return result
    }
    return { success: false, errCode: result.errCode, errMsg: result.errMsg}
  }
  
  /**
   * 微信支付订单号查询订单
   * @param transaction_id 微信支付订单号
   */
  public async queryOrderById(transaction_id: string): Promise<ApiResult<QueryOrderResult>>{
    let apiUrl = '/v3/pay/transactions/id/{transaction_id}'.replace('{transaction_id}', transaction_id);
  
    const queryObj = {
      mchid: this.mchid
    }
    // 获取接口url
    apiUrl = apiUrl + objToQueryString(queryObj);
  
    // 接口请求
    return await this.callApi({ method: HttpMethod.GET, apiUrl })
  }
  
  /**
   * 商户订单号查询订单
   * @param out_trade_no 商户订单号
   */
  public async queryOrderByOutTradeNo(out_trade_no: string): Promise<ApiResult<QueryOrderResult>>{
    let apiUrl = '/v3/pay/transactions/out-trade-no/{out_trade_no}'.replace('{out_trade_no}', out_trade_no);
  
    const queryObj = {
      mchid: this.mchid
    }
    // 获取接口url
    apiUrl = apiUrl + objToQueryString(queryObj);
  
    // 接口请求
    return await this.callApi({ method: HttpMethod.GET, apiUrl })
  }
  
  /**
   * 关闭订单
   * @param out_trade_no 商户订单号
   */
  public async closeOrder(out_trade_no: string): Promise<ApiResult<void>>{
    const apiUrl = '/v3/pay/transactions/out-trade-no/{out_trade_no}/close'.replace('{out_trade_no}', out_trade_no);
  
    const body = {
      mchid: this.mchid
    }
  
    // 接口请求
    return await this.callApi({ method: HttpMethod.POST, apiUrl, body})
  }

  /**
   * 申请退款
   * @param params 参数 
   */
  public async createRefund(params: CreateRefundParams): Promise<ApiResult<RefundInfo>>{
    if(!params.transaction_id && !params.out_trade_no){
      throw new Error('请填写微信支付订单号 或 商户订单号')
    }
    const apiUrl = '/v3/refund/domestic/refunds';
  
  
    // 接口请求
    return await this.callApi({ method: HttpMethod.POST, apiUrl, body: params})
  }

  /**
   * 查询单笔退款（通过商户退款单号）
   * @param out_refund_no 商户退款单号
   */
  public async queryRefundByOutRefundNo(out_refund_no: string): Promise<ApiResult<RefundInfo>>{
    const apiUrl = '/v3/refund/domestic/refunds/{out_refund_no}'.replace('{out_refund_no}', out_refund_no);
  
    // 接口请求
    return await this.callApi({ method: HttpMethod.GET, apiUrl })
  }

  /**
   * 申请交易账单
   * @param params 参数
   */
  public async tradeBill(params: TradeBillParams): Promise<ApiResult<BillResult>> {
    const apiUrl = '/v3/bill/tradebill' + objToQueryString({...params});

    return await this.callApi({ method: HttpMethod.GET, apiUrl })
  }

  /**
   * 申请资金账单
   * @param params 参数
   */
  public async fundFlowBill(params: FundFlowBillParams): Promise<ApiResult<BillResult>> {
    const apiUrl = '/v3/bill/fundflowbill' + objToQueryString({...params});

    return await this.callApi({ method: HttpMethod.GET, apiUrl })
  }

  //#endregion
}

export default WechatPayDirect