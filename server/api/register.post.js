import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Path to your JSON file
    // const filePath = path.join(process.cwd(), 'server/data/users.json')
    const filePath = path.join(__dirname, '../data/users.json')
    
    // Read existing data
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Add new user
    const newUser = {
      id: Date.now(),
      name: body.name,
    //   email: body.email,
      contactNo: body.contactNo,
      password: body.password,
      confirmPassword: body.confirmPassword,
      registeredAt: new Date().toISOString()
    }
    
    jsonData.users.push(newUser)
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
    
    return { success: true, user: newUser }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed'
    })
  }
})