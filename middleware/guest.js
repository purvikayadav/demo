export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const session = localStorage.getItem('teacherSession')
    
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        
        if (sessionData.isLoggedIn) {
          // Check if session is expired (24 hours)
          const loginTime = new Date(sessionData.loginTime)
          const now = new Date()
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
          
          if (hoursDiff > 24) {
            // Session expired, clear it
            localStorage.removeItem('teacherSession')
            console.log('Session expired, allowing access to guest page')
            return
          }
          
          // User is logged in and session is valid, redirect to dashboard
          console.log('User is already logged in, redirecting to dashboard')
          return navigateTo('/TeacherDashboard')
        }
      } catch (error) {
        // Invalid session data, clear it
        console.log('Invalid session data, clearing and allowing access')
        localStorage.removeItem('teacherSession')
      }
    }
    
    // No valid session, user can access guest pages
    console.log('No active session, allowing access to guest page')
  }
})