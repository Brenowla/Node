import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import Edit from '../views/Edit.vue'

import axios from 'axios'

function AdminAuth(to, from, next) {
  if (localStorage.getItem('token')) {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    axios.post("http://localhost:8686/validate", {}, req).then(res => {
      console.log(res)
      next()
    }).catch(err => {
      console.log(err)
      next("/login")
    })
  } else {
    next("/login")
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/admin/users',
    name: 'Users',
    component: Users,
    beforeEnter: AdminAuth
  },{
    path: '/admin/users/edit/:id',
    name: 'UsersEdit',
    component: Edit,
    beforeEnter: AdminAuth
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
