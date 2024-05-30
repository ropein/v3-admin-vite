const Layouts = () => import("@/layouts/index.vue")

export default {
  path: "/menu",
  component: Layouts,
  redirect: "/menu/menu1",
  name: "Menu",
  meta: {
    title: "多级路由",
    svgIcon: "menu"
  },
  children: [
    {
      path: "menu1",
      component: () => import("@/views/menu/menu1/index.vue"),
      redirect: "/menu/menu1/menu1-1",
      name: "Menu1",
      meta: {
        title: "menu1"
      },
      children: [
        {
          path: "menu1-1",
          component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
          name: "Menu1-1",
          meta: {
            title: "menu1-1",
            keepAlive: true
          }
        },
        {
          path: "menu1-2",
          component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
          redirect: "/menu/menu1/menu1-2/menu1-2-1",
          name: "Menu1-2",
          meta: {
            title: "menu1-2"
          },
          children: [
            {
              path: "menu1-2-1",
              component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
              name: "Menu1-2-1",
              meta: {
                title: "menu1-2-1",
                keepAlive: true
              }
            },
            {
              path: "menu1-2-2",
              component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
              name: "Menu1-2-2",
              meta: {
                title: "menu1-2-2",
                keepAlive: true
              }
            }
          ]
        },
        {
          path: "menu1-3",
          component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
          name: "Menu1-3",
          meta: {
            title: "menu1-3",
            keepAlive: true
          }
        }
      ]
    },
    {
      path: "menu2",
      component: () => import("@/views/menu/menu2/index.vue"),
      name: "Menu2",
      meta: {
        title: "menu2",
        keepAlive: true
      }
    }
  ]
}
