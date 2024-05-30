import { type RouteRecordRaw, createRouter, BaseRouteConfig, RouteWithDefault } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"
// import { menuApi } from "@/api/menu"

const Layouts = () => import("@/layouts/index.vue")

let dongtaiMenu = []
const getMenu = async () => {
  // const res = await menuApi({})
  // menuApi({}).then((res) => {
  const routeFiles = import.meta.glob("../router/main/**/*.ts", { eager: true }) as Record<string, RouteWithDefault>
  const routes: BaseRouteConfig[] = []
  for (const path in routeFiles) {
    if (Object.prototype.hasOwnProperty.call(routeFiles, path)) {
      const routeConfig = routeFiles[path].default // 或者根据实际情况调整导出名
      routes.push(routeConfig)
    }
  }
  dongtaiMenu = [
    {
      name: "表格",
      path: "table",
      children: [
        {
          name: "element表格",
          path: "element-plus",
          children: []
        },
        {
          name: "vxe-table",
          path: "vxe-table",
          children: []
        },
        {
          name: "vxe-table2",
          path: "vxe-table2",
          children: []
        }
      ]
    },
    {
      name: "首页",
      path: "dashboard",
      children: [
        {
          name: "shouye", //后端不返回或者返回“”则用前端配置的路由
          path: "dashboard-index"
        }
        // {
        //   name: "unocss-index",
        //   path: "unocss-index"
        // }
      ]
    },
    {
      name: "unocss",
      path: "unocss",
      children: [
        {
          name: "unocss-index",
          path: "unocss-index"
        }
      ]
    },

    {
      name: "外链",
      path: "link",
      children: [
        {
          name: "中文文档", //后端不返回或者返回“”则用前端配置的路由
          path: "https://juejin.cn/post/7089377403717287972"
        },
        {
          name: "新手教程1", //后端不返回或者返回“”则用前端配置的路由
          path: "https://juejin.cn/column/7207659644487139387"
        }
      ]
    }
  ]

  function flattenWithPaths(items: BaseRouteConfig[] = []) {
    let result = [] as BaseRouteConfig[]

    items.forEach((item) => {
      // 创建当前项目的路径，基于父路径和当前索引或名称
      const currentPath = [item.path]

      // 删除children属性以避免重复处理，同时保留其他所有属性
      const currentItemWithoutChildren = { ...item }

      // 添加路径信息到当前项目
      currentItemWithoutChildren.path = currentPath.join("/")

      result.push(currentItemWithoutChildren)

      // 如果有children，递归处理并合并结果
      if (item.children && item.children.length > 0) {
        result = result.concat(flattenWithPaths(item.children))
      }
    })

    return result
  }

  function buildRoutes(menu: BaseRouteConfig[], localRoutes: BaseRouteConfig[]) {
    return menu.map((item: any) => {
      let route: BaseRouteConfig | null = null // 初始化route变量
      localRoutes?.forEach((localRoute: any) => {
        // 使用some代替forEach以便提前终止循环
        if (localRoute.path === item.path) {
          // if (item.path === "unocss-index") {

          // }
          route = {
            path: item.path, // 添加/:subPath?以支持子路由（这部分按需调整）
            component: localRoute.component,
            redirect: localRoute.redirect,
            name: item?.name || localRoute?.meta?.title,
            meta: {
              ...localRoute.meta
              // affix: localRoute.meta.affix,
              // title: item.name || localRoute.meta.title // 假设没有专门的title字段，则使用name作为标题
            }
          } as BaseRouteConfig
          if (localRoute.children) {
            route.children = buildRoutes(item.children, flattenWithPaths(routes)) // 修正这里，确保子路由被正确赋值
          }
          return true // 匹配到后终止循环
        }
      })

      // 确保即使没有匹配的localRoute，也返回一个基本的route结构，根据实际情况调整
      if (!route) {
        route = {
          path: item.path,
          name: item.name,
          meta: item.meta
        }
        if (item.children && item.children.length > 0) {
          route.redirect = `${item.path}/${item.children[0].path}` // 设置重定向到第一个子路由
          route.children = buildRoutes(item.children, flattenWithPaths(routes)) // 递归构建子路由
        }
      }

      return route as BaseRouteConfig
    })
  }

  // todo:这里的any需要后端接口也定义下来之后再改
  const routess = buildRoutes(dongtaiMenu as any[], flattenWithPaths(routes))

  routess.map((item) => {
    item.path = "/" + item.path
    return item
  })
  return routess
}

const staticRoutes = [
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  }
]
const dynamicRoutesFromInterface = await getMenu()
// console.log(155, dynamicRoutesFromInterface[0])
const getRoutes = () => {
  const firstRedirectRoute = {
    path: "/",
    component: Layouts,
    meta: dynamicRoutesFromInterface[0].meta,
    redirect: dynamicRoutesFromInterface[0].children?.[0]?.path,
    children: dynamicRoutesFromInterface[0].children,
    name: dynamicRoutesFromInterface[0]?.name
  } as unknown as BaseRouteConfig
  dynamicRoutesFromInterface[0] = firstRedirectRoute
  return [...staticRoutes, ...dynamicRoutesFromInterface]
}
export const constantRoutes = getRoutes()
// export const constantRoutes = getRoutes()
/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
// export const constantRoutes: RouteRecordRaw[] = [
//   {
//     path: "/redirect",
//     component: Layouts,
//     meta: {
//       hidden: true
//     },
//     children: [
//       {
//         path: ":path(.*)",
//         component: () => import("@/views/redirect/index.vue")
//       }
//     ]
//   },
//   {
//     path: "/403",
//     component: () => import("@/views/error-page/403.vue"),
//     meta: {
//       hidden: true
//     }
//   },
//   {
//     path: "/404",
//     component: () => import("@/views/error-page/404.vue"),
//     meta: {
//       hidden: true
//     },
//     alias: "/:pathMatch(.*)*"
//   },
//   {
//     path: "/login",
//     component: () => import("@/views/login/index.vue"),
//     meta: {
//       hidden: true
//     }
//   },
//   {
//     path: "/",
//     component: Layouts,
//     redirect: "/dashboard",
//     children: [
//       {
//         path: "dashboard",
//         component: () => import("@/views/dashboard/index.vue"),
//         name: "Dashboard",
//         meta: {
//           title: "首页",
//           svgIcon: "dashboard",
//           affix: true
//         }
//       }
//     ]
//   },
//   {
//     path: "/unocss",
//     component: Layouts,
//     redirect: "/unocss/index",
//     children: [
//       {
//         path: "index",
//         component: () => import("@/views/unocss/index.vue"),
//         name: "UnoCSS",
//         meta: {
//           title: "UnoCSS",
//           svgIcon: "unocss"
//         }
//       }
//     ]
//   },
//   {
//     path: "/link",
//     meta: {
//       title: "外链",
//       svgIcon: "link"
//     },
//     children: [
//       {
//         path: "https://juejin.cn/post/7089377403717287972",
//         component: () => {},
//         name: "Link1",
//         meta: {
//           title: "中文文档"
//         }
//       },
//       {
//         path: "https://juejin.cn/column/7207659644487139387",
//         component: () => {},
//         name: "Link2",
//         meta: {
//           title: "新手教程"
//         }
//       }
//     ]
//   },
//   {
//     path: "/table",
//     component: Layouts,
//     redirect: "/table/element-plus",
//     name: "Table",
//     meta: {
//       title: "表格",
//       elIcon: "Grid"
//     },
//     children: [
//       {
//         path: "element-plus",
//         component: () => import("@/views/table/element-plus/index.vue"),
//         name: "ElementPlus",
//         meta: {
//           title: "Element Plus",
//           keepAlive: true
//         }
//       },
//       {
//         path: "vxe-table",
//         component: () => import("@/views/table/vxe-table/index.vue"),
//         name: "VxeTable",
//         meta: {
//           title: "Vxe Table",
//           keepAlive: true
//         }
//       }
//     ]
//   },
//   {
//     path: "/menu",
//     component: Layouts,
//     redirect: "/menu/menu1",
//     name: "Menu",
//     meta: {
//       title: "多级路由",
//       svgIcon: "menu"
//     },
//     children: [
//       {
//         path: "menu1",
//         component: () => import("@/views/menu/menu1/index.vue"),
//         redirect: "/menu/menu1/menu1-1",
//         name: "Menu1",
//         meta: {
//           title: "menu1"
//         },
//         children: [
//           {
//             path: "menu1-1",
//             component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
//             name: "Menu1-1",
//             meta: {
//               title: "menu1-1",
//               keepAlive: true
//             }
//           },
//           {
//             path: "menu1-2",
//             component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
//             redirect: "/menu/menu1/menu1-2/menu1-2-1",
//             name: "Menu1-2",
//             meta: {
//               title: "menu1-2"
//             },
//             children: [
//               {
//                 path: "menu1-2-1",
//                 component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
//                 name: "Menu1-2-1",
//                 meta: {
//                   title: "menu1-2-1",
//                   keepAlive: true
//                 }
//               },
//               {
//                 path: "menu1-2-2",
//                 component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
//                 name: "Menu1-2-2",
//                 meta: {
//                   title: "menu1-2-2",
//                   keepAlive: true
//                 }
//               }
//             ]
//           },
//           {
//             path: "menu1-3",
//             component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
//             name: "Menu1-3",
//             meta: {
//               title: "menu1-3",
//               keepAlive: true
//             }
//           }
//         ]
//       },
//       {
//         path: "menu2",
//         component: () => import("@/views/menu/menu2/index.vue"),
//         name: "Menu2",
//         meta: {
//           title: "menu2",
//           keepAlive: true
//         }
//       }
//     ]
//   },
//   {
//     path: "/hook-demo",
//     component: Layouts,
//     redirect: "/hook-demo/use-fetch-select",
//     name: "HookDemo",
//     meta: {
//       title: "Hook",
//       elIcon: "Menu",
//       alwaysShow: true
//     },
//     children: [
//       {
//         path: "use-fetch-select",
//         component: () => import("@/views/hook-demo/use-fetch-select.vue"),
//         name: "UseFetchSelect",
//         meta: {
//           title: "useFetchSelect"
//         }
//       },
//       {
//         path: "use-fullscreen-loading",
//         component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
//         name: "UseFullscreenLoading",
//         meta: {
//           title: "useFullscreenLoading"
//         }
//       },
//       {
//         path: "use-watermark",
//         component: () => import("@/views/hook-demo/use-watermark.vue"),
//         name: "UseWatermark",
//         meta: {
//           title: "useWatermark"
//         }
//       }
//     ]
//   }
// ]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面级",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "按钮级" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache
    ? flatMultiLevelRoutes(constantRoutes as RouteRecordRaw[])
    : (constantRoutes as RouteRecordRaw[])
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
