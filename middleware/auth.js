export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const session = localStorage.getItem('teacherSession')
    
    if (!session) {
      // No session found, redirect to login
      console.log('No session found, redirecting to login')
      return navigateTo('/TeacherLogin')
    }
    
    try {
      const sessionData = JSON.parse(session)
      
      if (!sessionData.isLoggedIn) {
        // Invalid session, redirect to login
        console.log('Invalid session, redirecting to login')
        localStorage.removeItem('teacherSession')
        return navigateTo('/TeacherLogin')
      }
      
      // Check if session is expired (24 hours)
      const loginTime = new Date(sessionData.loginTime)
      const now = new Date()
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        // Session expired, clear and redirect
        console.log('Session expired, redirecting to login')
        localStorage.removeItem('teacherSession')
        return navigateTo('/TeacherLogin')
      }
      
      // Session is valid, user can proceed
      console.log('Valid session found, allowing access to protected page')
      
    } catch (error) {
      // Invalid session data, clear and redirect
      console.log('Error parsing session, redirecting to login')
      localStorage.removeItem('teacherSession')
      return navigateTo('/TeacherLogin')
    }
  }
})