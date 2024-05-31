import { request } from "@/utils/service"
// import type * as Menu from "./types/menu"

/** 获取登录验证码 */
export function menuApi(data: any) {
  return request<any>({
    url: "/v2/menu",
    method: "post",
    data
  })
}
