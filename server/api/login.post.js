import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    // Enhanced CORS headers
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    })

    // Handle preflight
    if (getMethod(event) === 'OPTIONS') {
      return ''
    }

    const body = await readBody(event)
    
    // Validate input
    if (!body?.contactNo || !body?.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Contact number and password are required'
      })
    }

    console.log('🔍 Login attempt for:', body.contactNo.substring(0, 3) + '***')
    console.log('🌍 Environment:', dataManager.getEnvironmentInfo())

    // Read users data with error handling
    const userData = await dataManager.readData('users.json')
    
    if (!userData.users || !Array.isArray(userData.users)) {
      console.error('❌ Users data structure invalid')
      throw createError({
        statusCode: 500,
        statusMessage: 'User database is not properly initialized'
      })
    }

    // Find user
    const user = userData.users.find(u => 
      u.contactNo?.trim() === body.contactNo.trim()
    )

    if (!user) {
      console.log('❌ User not found')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid contact number or password'
      })
    }

    // Verify password
    if (user.password !== body.password) {
      console.log('❌ Invalid password')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid contact number or password'
      })
    }

    // Update last login
    user.lastLogin = new Date().toISOString()
    
    // Save with error handling
    try {
      await dataManager.writeData('users.json', userData)
    } catch (writeError) {
      console.warn('⚠️ Could not update last login time:', writeError.message)
      // Continue anyway - login is successful
    }

    // Return success
    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ Login successful for user:', user.id)
    
    return { 
      success: true, 
      user: userWithoutPassword,
      message: 'Login successful',
      token: `teacher_${user.id}_${Date.now()}`,
      environment: dataManager.getEnvironmentInfo()
    }
    
  } catch (error) {
    console.error('💥 Login error:', error)
    
    // Enhanced error response
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Login failed: ${error.message}`
    })
  }
})

