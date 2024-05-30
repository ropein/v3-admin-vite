const Layouts = () => import("@/layouts/index.vue")
export default {
  path: "unocss",
  component: Layouts,
  redirect: "/unocss/unocss-index",
  meta: {
    title: "UnoCSS总",
    svgIcon: "unocss"
  },
  children: [
    {
      path: "unocss-index",
      component: () => import("@/views/unocss/index.vue"),
      name: "UnoCSS",
      meta: {
        title: "UnoCSS子",
        svgIcon: "unocss"
      }
    }
  ]
}
