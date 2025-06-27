import fs from 'fs'
import path from 'path'

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
    
    // Validate input - only name, contactNo, and password required
    if (!body.name || !body.contactNo || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, contact number, and password are required'
      })
    }

    // Validate contact number format
    const contactRegex = /^[0-9+\-\s()]+$/
    if (!contactRegex.test(body.contactNo)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid contact number format'
      })
    }

    // Validate contact number length (at least 10 digits)
    const digitCount = body.contactNo.replace(/\D/g, '').length
    if (digitCount < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Contact number must be at least 10 digits'
      })
    }

    // Validate password strength
    if (body.password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    // Register user
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

// Register user function
async function registerUser(userData) {
  const { name, contactNo, password } = userData
  
  // Path to users JSON file
  const filePath = path.join(process.cwd(), 'server/data/users.json')
  
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  // Read existing data or create new structure
  let jsonData
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    try {
      jsonData = JSON.parse(fileContent)
      if (!jsonData.users || !Array.isArray(jsonData.users)) {
        jsonData.users = []
      }
    } catch (parseError) {
      console.error('Error parsing users file, creating new structure:', parseError)
      jsonData = { users: [] }
    }
  } else {
    jsonData = { users: [] }
  }

  try {
    // Check if user already exists with this contact number
    const existingUser = jsonData.users.find(user => user.contactNo.trim() === contactNo.trim())
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists with this contact number'
      })
    }

    // Generate unique user ID
    const userId = Date.now()

    // Create user object (no email, no password hashing for now)
    const user = {
      id: userId,
      name: name.trim(),
      contactNo: contactNo.trim(),
      password: password, // In production, hash this with bcrypt
      registeredAt: new Date().toISOString(),
      lastLogin: null
    }

    // Add user to array
    jsonData.users.push(user)

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))

    console.log('=== USER REGISTRATION DEBUG ===')
    console.log('New user registered:', {
      id: user.id,
      name: user.name,
      contactNo: user.contactNo,
      registeredAt: user.registeredAt
    })
    console.log('Total users now:', jsonData.users.length)
    console.log('=== END DEBUG ===')

    // Return user data (without password)
    const { password: _, ...userResponse } = user
    
    return {
      user: userResponse,
      message: 'User registered successfully'
    }

  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}