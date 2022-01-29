import { createRouter, createWebHistory } from 'vue-router'
import { getUser, isAuthorized } from "@/helpers/authorization"
import { Role } from "@/helpers/role"
import Home from "@/views/home/Index"
import Login from "@/views/account/Login"
import Register from "@/views/account/Register"
import ForgotPassword from "@/views/account/ForgotPassword"
import VerifyEmail from "@/views/account/VerifyEmail"
import ResetPassword from "@/views/account/ResetPassword"
import Profile from "@/views/profile/Index"
import ProfileUpdate from "@/views/profile/Update"
import Admin from "@/views/admin/Index"
import UsersList from "@/views/admin/users/List"
import UserCreate from "@/views/admin/users/Create"
import UserEdit from "@/views/admin/users/Edit"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { authorized: [] }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { authorized: [] }
  },
  {
    path: '/profile/update',
    name: 'ProfileUpdate',
    component: ProfileUpdate,
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

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "active",
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  const { authorized } = to.meta
  const { role } = getUser();
  if (authorized) {
    if (!isAuthorized()) return next({ name: 'Login' })
    if (authorized.length && !authorized.includes(role)) return next({ name: 'Home' })
  }
  next()
})
