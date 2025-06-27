import db from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, contactNo, password } = body
    
    // Validate input
    if (!name || !contactNo || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, contact number, and password are required'
      })
    }
    
    // Validate password strength
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }
    
    // Create new user
    const newUser = await db.createUser({
      name: name.trim(),
      contactNo: contactNo.trim(),
      password: password // In production, hash this with bcrypt
    })
    
    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser
    
    return { 
      success: true, 
      user: userWithoutPassword,
      message: 'Registration successful'
    }
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    if (error.message.includes('already exists')) {
      throw createError({
        statusCode: 409,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed. Please try again.'
    })
  }
})