/**
 * 微信支付平台证书信息
 */
export type CertificateInfo = {
    serial_no: string, // 证书序列号
    effective_time: string // 证书有效期开始时间
    expire_time: string // 证书过期时间
    encrypt_certificate: {
        algorithm: string, // 加密所使用的算法，目前可能取值仅为 AEAD_AES_256_GCM
        nonce: string, // 加密所使用的随机字符串
        associated_data: string, // 附加数据包（可能为空）
        ciphertext: string, // 证书内容密文，解密后会获得证书完整内容
    } // 证书过期时间
}
/**
 * 微信支付平台证书列表
 */
export type CertificatesResult = {
    data: CertificateInfo[]
}

/**
 * 验签参数
 */
export type VerifyParams = {
    timestamp: string, // HTTP头Wechatpay-Timestamp 中的应答时间戳
    nonce: string, // HTTP头Wechatpay-Nonce 中的应答随机串
    body: Record<string, any> | string, // 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败
    serialNumber: string, // HTTP头Wechatpay-Serial 证书序列号
    signature: string, // HTTP头Wechatpay-Signature 签名
    apiSecret: string, // APIv3密钥
    certificates: CertificateInfo[], // 微信证书列表
}