import fs from 'fs'
import path from 'path'

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
    
    // Path to your JSON file
    const filePath = path.join(process.cwd(), 'server/data/users.json')
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Users database not found'
      })
    }
    
    // Read existing data
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Find user by contact number
    const user = jsonData.users.find(u => u.contactNo === contactNo)
    
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
    user.lastLogin = new Date().toISOString()
    
    // Save updated data
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
    
    // Return success with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    
    return { 
      success: true, 
      user: userWithoutPassword,
      message: 'Login successful',
      token: `teacher_${user.id}_${Date.now()}` // Simple token for session
    }
    
  } catch (error) {
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