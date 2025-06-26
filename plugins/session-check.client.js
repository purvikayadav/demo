export default defineNuxtPlugin(() => {
  // This plugin runs on every page load on the client side
  
  const checkAndRedirectSession = () => {
    const session = localStorage.getItem('teacherSession')
    const currentPath = window.location.pathname
    
    // Protected routes that need authentication
    const protectedRoutes = ['/TeacherDashboard']
    
    // Guest routes that logged-in users shouldn't access
    const guestRoutes = ['/', '/TeacherLogin', '/TeacherSignUp']
    
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        
        if (sessionData.isLoggedIn) {
          // Check if session is expired
          const loginTime = new Date(sessionData.loginTime)
          const now = new Date()
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
          
          if (hoursDiff > 24) {
            // Session expired
            localStorage.removeItem('teacherSession')
            if (protectedRoutes.includes(currentPath)) {
              navigateTo('/TeacherLogin')
            }
            return
          }
          
          // Valid session - redirect from guest pages to dashboard
          if (guestRoutes.includes(currentPath)) {
            console.log('User is logged in, redirecting from guest page to dashboard')
            navigateTo('/TeacherDashboard')
          }
        } else {
          // Invalid session
          localStorage.removeItem('teacherSession')
          if (protectedRoutes.includes(currentPath)) {
            navigateTo('/TeacherLogin')
          }
        }
      } catch (error) {
        // Corrupted session data
        localStorage.removeItem('teacherSession')
        if (protectedRoutes.includes(currentPath)) {
          navigateTo('/TeacherLogin')
        }
      }
    } else {
      // No session - redirect from protected pages to login
      if (protectedRoutes.includes(currentPath)) {
        navigateTo('/TeacherLogin')
      }
    }
  }
  
  // Run the check when the plugin initializes
  if (process.client) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      checkAndRedirectSession()
    }, 100)
  }
})