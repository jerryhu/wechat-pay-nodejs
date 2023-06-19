import x509_1 = require('@fidm/x509');

/**
 * 获取当前时间的时间戳(秒)
 */
export function currentTimestamp(): string {
  return String(Date.parse(new Date().toString()) / 1000);
}

/**
 * 生成随机数
 * @param n 位数
 */
export function generateNonce(): string {
  return Math.random()
    .toString(36)
    .slice(2, 15)
}

/**
 * 从证书内容读取序列号
 * @param fileData 证书内容
 */
export const getSN = (fileData?: Buffer): string => {
  const certificate = x509_1.Certificate.fromPEM(fileData);
  return certificate.serialNumber;
}

/**
 * 对象转换为query string
 * @param object 对象
 */
export const objToQueryString = (object: Record<string, string>) : string => {
  let str = Object.keys(object).sort()
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
    })
    .join('&');
  if (str) str = '?' + str;
  return str || '';
}