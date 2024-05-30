const Layouts = () => import("@/layouts/index.vue")

export default {
  path: "/hook-demo",
  component: Layouts,
  redirect: "/hook-demo/use-fetch-select",
  name: "HookDemo",
  meta: {
    title: "Hook",
    elIcon: "Menu",
    alwaysShow: true
  },
  children: [
    {
      path: "use-fetch-select",
      component: () => import("@/views/hook-demo/use-fetch-select.vue"),
      name: "UseFetchSelect",
      meta: {
        title: "useFetchSelect"
      }
    },
    {
      path: "use-fullscreen-loading",
      component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
      name: "UseFullscreenLoading",
      meta: {
        title: "useFullscreenLoading"
      }
    },
    {
      path: "use-watermark",
      component: () => import("@/views/hook-demo/use-watermark.vue"),
      name: "UseWatermark",
      meta: {
        title: "useWatermark"
      }
    }
  ]
}
