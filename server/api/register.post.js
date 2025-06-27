export default defineEventHandler(async (event) => {
  try {
    // Set CORS headers for production
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    })

    // Handle preflight requests
    if (getMethod(event) === 'OPTIONS') {
      return ''
    }

    // Read request body
    const body = await readBody(event)
    
    // Validate input
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Your registration logic here
    const result = await registerUser(body)
    
    return {
      success: true,
      data: result
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // Return proper error response
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})