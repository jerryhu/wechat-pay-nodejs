import * as crypto from 'crypto'
import { getSN, currentTimestamp, generateNonce } from "./utils";
import { ApiResult, HttpMethod, WechatPayConfig, CertificatesResult, VerifyParams, CertificateInfo } from "../typings";
import { apiRequest } from "./request";
import { ResponseType } from "axios";
import constant from "./constant";

class WechatPayBase {
  public appid: string; //  服务商应用ID / 直连商户应用ID
  public mchid: string; //  服务商户号 / 直连商户号
  private cert_private_content: Buffer; // API证书私钥
  private cert_public_content: Buffer; // API证书公钥
  private serial_no = ''; // API证书公钥序列号
  public user_agent = constant.DEFAULT_USER_AGENT;
  private auth_type = 'WECHATPAY2-SHA256-RSA2048';

  /**
   * WechatPay对象初始化
   * @param config 初始化参数
   * @example {
        appid: string, //  服务商应用ID / 直连商户应用ID
        mchid: string, //  服务商户号 / 直连商户号
        cert_private_content: Buffer, // API证书私钥内容
        cert_public_content: Buffer, // API证书公钥内容
        user_agent?: string, // User-Agent
      }
   */
  constructor(config: WechatPayConfig){
    if(!config.cert_private_content){
      throw new Error('初始化WechatPay对象失败，API证书私钥不能为空');
    }
    if(!config.cert_public_content){
      throw new Error('初始化WechatPay对象失败，API证书公钥不能为空');
    }
    this.appid = config.appid;
    this.mchid = config.mchid;
    if(config.user_agent){
      this.user_agent = config.user_agent;
    }
    this.cert_private_content = config.cert_private_content;
    this.cert_public_content = config.cert_public_content;
    // 从证书公钥内容读取序列号
    this.serial_no = getSN(config.cert_public_content);
  }

  /**
   * 获取签名信息
   * @param params 参数
   */
  public getAuthorization(params: {
    method: string, // Http 请求方式
    apiUrl: string, // 接口路径 (包含query string)
    body?: string, // 请求报文主体
}) : string{
    const timestamp = currentTimestamp();
    const nonce = generateNonce();
    const body = params.body ? params.body : '';
    const dataToSign = `${params.method}\n${params.apiUrl}\n${timestamp}\n${nonce}\n${body}\n`;
    const signature = this.sign(dataToSign);
    return `${this.auth_type} mchid="${this.mchid}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${this.serial_no}",signature="${signature}"`;
  }

  /**
   * 签名
   * @param data 需要签名的数据 
   */
  public sign(data: string) : string{
    return crypto.createSign('RSA-SHA256').update(data).sign(this.cert_private_content, 'base64');
  }

  /**
   * 验签
   * @param params 参数
   * @example{
        timestamp: string | number, // 应答时间戳（HTTP头Wechatpay-Timestamp）
        nonce: string, // 应答随机串（HTTP头Wechatpay-Nonce）
        body: Record<string, any> | string, // 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败
        serialNumber: string, // 证书序列号（HTTP头Wechatpay-Serial）
        signature: string, // 签名（HTTP头Wechatpay-Signature）
        apiSecret: string, // APIv3密钥
        certificates: CertificateInfo[], // 微信平台证书列表 (调用getCertificates接口获取，建议缓存10小时)
     }
   */
  public verify(params: VerifyParams) : boolean {
    if(!params.certificates || params.certificates.length === 0){
      throw new Error('微信平台证书不能为空');
    }
    const certificate = params.certificates.find(o=>o.serial_no === params.serialNumber);
    if(!certificate){
      throw new Error('未找到指定序列号的微信平台证书');
    }
    // 微信证书数据解密
    const publicKey = this.decryptAesGcm({
      ciphertext: certificate.encrypt_certificate.ciphertext,
      associatedData: certificate.encrypt_certificate.associated_data,
      nonce: certificate.encrypt_certificate.nonce,
      apiV3Key: params.apiSecret
    })
  
    const body = typeof params.body === 'string' ? params.body : JSON.stringify(params.body);
    const data = `${params.timestamp}\n${params.nonce}\n${body}\n`;
    const verify = crypto.createVerify('RSA-SHA256').update(data);
    return verify.verify(publicKey, params.signature, 'base64');
  }

  /**
   * 微信支付平台证书和回调报文解密
   * @param params 参数
   * @example {
      ciphertext: string, // 密文
      associatedData: string, // 附加数据
      nonce: string, // 随机串
      apiV3Key: string, // APIv3密钥
     }
   */
  public decryptAesGcm(params: {
    ciphertext: string, // Base64编码后的密文
    associatedData: string, // 附加数据包（可能为空）
    nonce: string, // 加密使用的随机串
    apiV3Key: string, // APIv3密钥
  }) : string {
    if(!params.apiV3Key){
      throw new Error('APIv3密钥不能为空');
    }
    const ciphertextBuffer = Buffer.from(params.ciphertext, 'base64');
    const TAG_LENGTH = 16;
    const authTag = ciphertextBuffer.subarray(ciphertextBuffer.length - TAG_LENGTH);
    const data = ciphertextBuffer.subarray(0, ciphertextBuffer.length - TAG_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-gcm', params.apiV3Key, params.nonce);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(params.associatedData));
    const decoded = decipher.update(data, undefined, 'utf8');
    decipher.final();

    return decoded;
  }

  /**
   * 调用接口
   * @param params 参数
   * @example
    {
      method: HttpMethod, // GET | POST
      apiUrl: string, // 接口url 例如: /v3/pay/transactions/out-trade-no/{out-trade-no}?mchid={mchid}
      body?: Record<string, unknown> POST body 数据 (可选)
      baseURL?: string, // 选填，默认：https://api.mch.weixin.qq.com
    }
   */
  public async callApi<T>(params: {
    method: HttpMethod, // GET | POST
    apiUrl: string, // 接口url 例如: /v3/pay/transactions/out-trade-no/{out-trade-no}?mchid={mchid}
    body?: Record<string, unknown> // POST body 数据 (可选)
    baseURL?: string, // 选填，默认：https://api.mch.weixin.qq.com
    responseType?: ResponseType, // 响应数据的类型. 可选: 'arraybuffer', 'document', 'json', 'text', 'stream'。默认'json'
  }) : Promise<ApiResult<T>>{
    // 获取签名信息
    const authorization = this.getAuthorization({
      method: params.method, // Http 请求方式
      apiUrl: params.apiUrl, // 接口路径 (包含query string)
      body: params.body ? JSON.stringify(params.body) : undefined, // 请求报文主体
    });

    return await apiRequest<T>({
      apiUrl: params.apiUrl,
      method: params.method,
      data: params.body,
      authorization,
      userAgent: this.user_agent,
      baseURL: params.baseURL,
      responseType: params.responseType
    })
  }

  //#region 直连商户与服务商通用的接口
  /**
   * 获取平台证书列表
   * @param weixinPay 微信支付对象
   */
  public async getCertificates(): Promise<ApiResult<CertificateInfo[]>>{
    const apiUrl = '/v3/certificates';

    // 接口请求
    const result = await this.callApi<CertificatesResult>({ method: HttpMethod.GET, apiUrl});
    if(result.success && result.data){
      return {
        success: true,
        data: result.data.data
      }
    }
    else{
      return {
        success: false,
        data: [],
        errCode: result.errCode,
        errMsg: result.errMsg
      }
    }
  }

  /**
   * 下载账单
   * @param download_url 通过申请账单接口获取到“download_url”，URL有效期30s
   * @param responseType 响应数据的类型. 可选: 'arraybuffer', 'document', 'json', 'text', 'stream'
   */
  public async downloadBill(download_url: string, responseType: ResponseType) : Promise<ApiResult<any>>{
    const urlObj = new URL(download_url);
    
    return await this.callApi({
      method: HttpMethod.GET,
      apiUrl: `${urlObj.pathname}${urlObj.search}`,
      baseURL: `${urlObj.protocol}//${urlObj.hostname}`,
      responseType: responseType
    })
  }  
  //#endregion
}

export default WechatPayBase;
