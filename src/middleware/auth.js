export function requireAuth() {
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      window.location.href = '/login'
      return false
    }
    return true
  }
  return false
}

export function getUser() {
  if (typeof window !== 'undefined') {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('userRole'),
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
    }
  }
  return null
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    window.location.href = '/login'
  }
}
