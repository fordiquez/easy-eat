import { Role } from "@/utils/role";

export const isAuthorized = () => {
  const cookie = getCookie('refreshToken')
  const user = getUser()
  const token = getToken()
  const isRole = user?.role === Role.Admin || user?.role === Role.User
  if (!cookie && (user || isRole || token)) {
    localStorage.removeItem('user')
    localStorage.removeItem('jwtToken')
  }
  return !!(cookie && isRole && token?.token && token?.expires)
}

export const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\\.$?*|{}()[\]/+^])/g, '\\$1') + "=([^;]*)"))
  return matches ? decodeURIComponent(matches[1]) : null
}

export const getApplication = () => {
  const isApplication = localStorage.getItem('application') || false
  return isApplication ? JSON.parse(localStorage.getItem('application')) : null
}

export const getUser = () => {
  const isUser = localStorage.getItem('user') || false
  return isUser ? JSON.parse(localStorage.getItem('user')) : null
}

export const getToken = () => {
  const isToken = localStorage.getItem('jwtToken') || false
  return isToken ? JSON.parse(localStorage.getItem('jwtToken')) : null
}

export const isTokenExpired = (expires) => expires < new Date().getTime()

export const tokenExpirationTime = ({ jwtToken }) => {
  const token = JSON.parse(atob(jwtToken.split('.')[1]))
  return new Date(token.exp * 1000).getTime()
}
