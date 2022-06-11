import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken, getUser, isAuthorized } from "@/utils/storage"
import { Role } from "@/utils/role"
import Auth from "@/views/auth/Index"
import Login from "@/views/auth/Login"
import Register from "@/views/auth/Register"
import ForgotPassword from "@/views/auth/ForgotPassword"
import VerifyEmail from "@/views/auth/VerifyEmail"
import ResetPassword from "@/views/auth/ResetPassword"
import UserView from "@/views/admin/users/Show"
import Settings from "@/views/settings/Index"
import Profile from "@/views/settings/Profile"
import Account from "@/views/settings/Account"
import App from "@/views/settings/App"
import Admin from "@/views/admin/Index"
import Users from "@/views/admin/users/Index"
import DailyLog from "@/views/daily-log/Index"
import Onboarding from "@/views/onboarding/Index"
import MealPlan from "@/views/onboarding/MealPlan"
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/daily-log'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    redirect: '/',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        component: VerifyEmail
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPassword
      }
    ]
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
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { authorized: [Role.Admin] },
    redirect: '/admin/users',
    children: [
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { authorized: [Role.Admin] }
      },
      {
        path: 'users/view/:id',
        name: 'UserView',
        component: UserView,
        meta: { authorized: [Role.Admin] }
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
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { authorized: [] }
  },
  {
    path: '/onboarding/meal-plan',
    name: 'MealPlan',
    component: MealPlan,
    meta: { authorized: [] }
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
      return next({ name: 'Login', query: { returnUrl: to.path } })
    }
    if (authorized.length && !authorized.includes(user.role)) return next({ name: 'DailyLog' })
  }
  return next()
})

export default router
