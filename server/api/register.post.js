// Fixed Register API - server/api/register.post.js
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

    if (getMethod(event) === 'OPTIONS') {
      return ''
    }

    const body = await readBody(event)
    
    // Enhanced validation
    if (!body?.name || !body?.contactNo || !body?.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, contact number, and password are required'
      })
    }

    // Validate contact number
    const contactRegex = /^[0-9+\-\s()]+$/
    if (!contactRegex.test(body.contactNo)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact number format'
      })
    }

    const digitCount = body.contactNo.replace(/\D/g, '').length
    if (digitCount < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Contact number must be at least 10 digits'
      })
    }

    // Validate password
    if (body.password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    console.log('📝 Registration attempt for:', body.contactNo.substring(0, 3) + '***')
    console.log('🌍 Environment:', dataManager.getEnvironmentInfo())

    // Read existing users
    const userData = await dataManager.readData('users.json')
    
    // Ensure users array exists
    if (!userData.users) {
      userData.users = []
    }

    // Check for existing user
    const existingUser = userData.users.find(user => 
      user.contactNo?.trim() === body.contactNo.trim()
    )
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists with this contact number'
      })
    }

    // Create new user
    const userId = Date.now()
    const newUser = {
      id: userId,
      name: body.name.trim(),
      contactNo: body.contactNo.trim(),
      password: body.password, // In production, use bcrypt
      registeredAt: new Date().toISOString(),
      lastLogin: null
    }

    // Add to users array
    userData.users.push(newUser)

    // Save data
    await dataManager.writeData('users.json', userData)

    console.log('✅ User registered successfully:', userId)

    // Return response (without password)
    const { password: _, ...userResponse } = newUser
    
    return {
      success: true,
      data: {
        user: userResponse,
        message: 'User registered successfully'
      },
      environment: dataManager.getEnvironmentInfo()
    }

  } catch (error) {
    console.error('💥 Registration error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Registration failed: ${error.message}`
    })
  }
})
