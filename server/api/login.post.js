import db from '~/server/utils/database'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const { contactNo, password } = await readBody(event)
    
    // Validate input
    if (!contactNo || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Contact number and password are required'
      })
    }
    
    // Find user by contact number
    const user = await db.findUserByContact(contactNo)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid contact number or password'
      })
    }
    
    // Verify password (in production, use bcrypt for hashed passwords)
    if (user.password !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid contact number or password'
      })
    }
    
    // Update last login time
    await db.updateUser(user.id, { lastLogin: new Date().toISOString() })
    
    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { 
        userId: user.id, 
        contactNo: user.contactNo,
        name: user.name 
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    
    // Return success with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    
    return { 
      success: true, 
      user: { ...userWithoutPassword, lastLogin: new Date().toISOString() },
      message: 'Login successful',
      token
    }
    
  } catch (error) {
    console.error('Login error:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    // For any other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed. Please try again.'
    })
  }
})