import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken, getUser, isAuthorized} from "@/utils/storage"
import { Role } from "@/utils/role"
import Home from "@/views/home/Index"
import Login from "@/views/account/Login"
import Register from "@/views/account/Register"
import ForgotPassword from "@/views/account/ForgotPassword"
import VerifyEmail from "@/views/account/VerifyEmail"
import ResetPassword from "@/views/account/ResetPassword"
import Admin from "@/views/admin/Index"
import UsersList from "@/views/admin/users/List"
import UserCreate from "@/views/admin/users/Create"
import UserEdit from "@/views/admin/users/Edit"
import DailyLog from "@/views/daily-log/Index"
import Settings from "@/views/settings/Index"
import Profile from "@/views/settings/Profile"
import Account from "@/views/settings/Account";
import App from "@/views/settings/App"
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Home,
    meta: { authorized: [] }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { authorized: [] },
    redirect: '/settings/profile',
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { authorized: [] }
      },
      {
        path: 'account',
        name: 'Account',
        component: Account,
        meta: { authorized: [] }
      },
      {
        path: 'app',
        name: 'App',
        component: App,
        meta: { authorized: [] }
      }
    ]
  },
  {
    path: '/daily-log',
    name: 'DailyLog',
    component: DailyLog,
    meta: { authorized: [] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { authorized: [Role.Admin] }
  },
  {
    path: '/admin/users',
    name: 'UsersList',
    component: UsersList,
    meta: { authorized: [Role.Admin] }
  },
  {
    path: '/admin/users/create',
    name: 'UserCreate',
    component: UserCreate,
    meta: { authorized: [Role.Admin] }
  },
  {
    path: '/admin/users/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: { authorized: [Role.Admin] }
  },
  {
    path: '/account/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/account/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/account/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/account/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/account/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const { authorized } = to.meta
  const user = getUser()
  const token = getToken()
  if (authorized) {
    if (!isAuthorized()) {
      user || token ? store.commit('account/LOGOUT_USER') : null
      return next({ name: 'Login' })
    }
    if (authorized.length && !authorized.includes(user.role)) return next({ name: 'Home' })
  }
  next()
})

export default router
