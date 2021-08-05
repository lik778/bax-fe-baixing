export const getCookie = (name) => {
  let arr; const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

  // eslint-disable-next-line no-cond-assign
  if (arr = document.cookie.match(reg)) { return unescape(arr[2]) } else { return null }
}

export const delCookie = (name) => {
  const exp = new Date()
  exp.setTime(exp.getTime() - 1)
  const cval = getCookie(name)
  if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
}
