import axios from "axios";
import { ApiRequestParams, ApiResult } from "../typings";
import constant from "./constant";

/**
 * 接口请求
 * @param params 参数
 */
export async function apiRequest<T>(params: ApiRequestParams): Promise<ApiResult<T>> {
  try{
    const result = await axios({
      method: params.method,
      url: params.apiUrl,
      baseURL: params.baseURL ? params.baseURL : constant.BASE_URL,
      data: params.method === 'GET' ? undefined : params.data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': params.userAgent,
        'Authorization': `${params.authorization}`,
      },
      responseType: params.responseType ? params.responseType : 'json'
    });
    if(result.status === 200 || result.status === 204){
      return {
        success: true,
        data: result.data as T,
      };
    }
    else{
      return {
        success: false,
        data: result.data,
        errCode: String(result.status),
        errMsg: result.statusText
      }
    }
  }
  catch(error: any){
    // console.error(error)
    // 错误处理
    if(error.response && error.response.data){
      return {
        success: false,
        errCode: error.response.data.code,
        errMsg: error.response.data.message
      }
    }
    return {
      success: false,
      errCode: '0',
      errMsg: error.message
    }
  }
}