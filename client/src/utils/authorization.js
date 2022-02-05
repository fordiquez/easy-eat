export const isAuthorized = () => {
  const cookie = getCookie('refreshToken')
  const user = getUser()
  const { token, expires } = getToken()
  // const expiredToken = (token && expires) ? isTokenExpired(expires) : true
  return !!(cookie && user && token && expires)
}

export const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\\.$?*|{}()[\]/+^])/g, '\\$1') + "=([^;]*)"))
  return matches ? decodeURIComponent(matches[1]) : false
}

export const getUser = () => {
  // eslint-disable-next-line no-prototype-builtins
  const isUser = (localStorage.hasOwnProperty('user') && localStorage.getItem('user').length > 0) || false
  return isUser ? JSON.parse(localStorage.getItem('user')) : false
}

export const getToken = () => {
  // eslint-disable-next-line no-prototype-builtins
  const isToken = (localStorage.hasOwnProperty('jwtToken') && localStorage.getItem('jwtToken').length > 0) || false
  return isToken ? JSON.parse(localStorage.getItem('jwtToken')) : false
}

export const isTokenExpired = (expires) => expires < new Date().getTime()

export const tokenExpirationTime = ({ jwtToken }) => {
  // parse json object from base64 encoded jwt token
  const token = JSON.parse(atob(jwtToken.split('.')[1]))
  return new Date(token.exp * 1000).getTime()
}
