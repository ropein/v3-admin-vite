import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function menuApi(data) {
  return request<Login.LoginCodeResponseData>({
    url: "/v2/menu",
    method: "post",
    data
  })
}
