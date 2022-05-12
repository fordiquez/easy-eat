import { Role } from "@/utils/role"

export const isAuthorized = () => {
  const cookie = getCookie('refreshToken')
  const user = getUser()
  const token = getToken()
  return !!(cookie && user && token)
}

export const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\\.$?*|{}()[\]/+^])/g, '\\$1') + "=([^;]*)"))
  return matches ? decodeURIComponent(matches[1]) : null
}

export const getApplication = () => JSON.parse(localStorage.getItem('application')) || null

export const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.id && (user?.role === Role.Admin || user?.role === Role.User) ? user : null
}

export const getToken = () => {
  const jwtToken = JSON.parse(localStorage.getItem('jwtToken'))
  return jwtToken?.token && jwtToken?.expires ? jwtToken : null
}

export const isTokenExpired = expires => expires < new Date().getTime()

export const tokenExpirationTime = ({ jwtToken }) => {
  const token = JSON.parse(atob(jwtToken.split('.')[1]))
  return new Date(token.exp * 1000).getTime()
}
