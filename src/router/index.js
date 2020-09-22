import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/library",
    name: "Library",
    component: () => import("../views/Library.vue")
  },
  {
    meta: { requiresAuth: true },
    path: "/playlists",
    name: "Playlists",
    component: () => import("../views/Playlists.vue"),
  },
  {
    meta: { requiresAuth: true },
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    children: [
      {
        meta: { requiresAuth: true },
        path: "/users",
        name: "AdminUsers",
        component: () => import("@/components/admin/users/UserList.vue")
      },
      {
        meta: { requiresAuth: true },
        path: "/users/:username/edit",
        name: "AdminUsersEdit",
        component: () => import("@/components/admin/users/UserEdit.vue"),
        props: true
      },
      {
        meta: { requiresAuth: true },
        path: "/users/new",
        name: "AdminUsersNew",
        component: () => import("@/components/admin/users/UserEdit.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if ( to.matched.some(record => record.meta.requiresAuth) && Vue.prototype.$store.userToken == null )
    next( { name: "Login", query: { redirect: to.path } })
  else next()
});

export default router
