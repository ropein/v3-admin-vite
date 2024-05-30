export default {
  path: "link",
  meta: {
    title: "外链",
    svgIcon: "link"
  },
  children: [
    {
      path: "https://juejin.cn/post/7089377403717287972",
      component: () => {},
      name: "Link1",
      meta: {
        title: "中文文档"
      }
    },
    {
      path: "https://juejin.cn/column/7207659644487139387",
      component: () => {},
      name: "Link2",
      meta: {
        title: "新手教程"
      }
    }
  ]
}
