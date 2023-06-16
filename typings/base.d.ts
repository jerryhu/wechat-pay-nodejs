import { ResponseType } from "axios"

/**
 * 接口调用结果数据结构
 */
export type ApiResult<T> = {
    success: boolean, // 接口调用是否成功 (status === 200 || status === 204)
    data?: T, // 接口返回的结果
    errCode?: string, // 错误代码
    errMsg?: string, // 错误信息
}

/**
 * 接口请求参数
 */
export type ApiRequestParams = {
    apiUrl: string, // 接口路径 例如: /v3/pay/partner/transactions/jsapi
    method: HttpMethod // 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE', // HTTP Method
    data?: any, // 请求数据
    authorization: string, // 签名信息
    userAgent: string, // User Agent
    baseURL?: string, // axios baseURL
    responseType?: ResponseType, // 响应数据的类型. 可选: 'arraybuffer', 'document', 'json', 'text', 'stream'。默认'json'
}

/**
 * WechatPay设置
 */
export type WechatPayConfig = {
    appid: string, //  服务商应用ID / 直连商户应用ID
    mchid: string, //  服务商户号 / 直连商户号
    cert_private_content: Buffer, // API证书私钥
    cert_public_content: Buffer, // API证书公钥
    user_agent?: string, // User-Agent
}

export const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}
