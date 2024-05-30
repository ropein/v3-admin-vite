const Layouts = () => import("@/layouts/index.vue")
export default {
  path: "dashboard",
  name: "首页",
  component: Layouts,
  redirect: "/dashboard/dashboard-index",
  meta: {
    title: "首页",
    svgIcon: "dashboard"
  },
  children: [
    {
      path: "dashboard-index",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: "首页1",
        svgIcon: "dashboard",
        affix: true
      }
    }
    // {
    //   path: "unocss-index",
    //   component: () => import("@/views/unocss/index.vue"),
    //   name: "UnoCSS",
    //   meta: {
    //     title: "UnoCSS子",
    //     svgIcon: "unocss"
    //   }
    // }
  ]
}
