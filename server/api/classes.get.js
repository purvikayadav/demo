import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { teacherId } = query
    
    // Validate input
    if (!teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Teacher ID is required'
      })
    }
    
    // Path to your JSON file
    // const filePath = path.join(process.cwd(), 'server/data/classes.json')
    const filePath = path.join(__dirname, '../data/classes.json')
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('Classes file does not exist, returning empty array')
      return { 
        success: true, 
        classes: [],
        message: 'No classes found - file does not exist'
      }
    }
    
    // Read existing data
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Ensure classes array exists
    if (!jsonData.classes || !Array.isArray(jsonData.classes)) {
      console.log('Classes array does not exist in file')
      return { 
        success: true, 
        classes: [],
        message: 'No classes array found in file'
      }
    }
    
    // Filter classes by teacher ID (convert both to string for comparison)
    const teacherClasses = jsonData.classes.filter(c => 
      String(c.teacherId) === String(teacherId)
    )
    
    console.log('=== GET CLASSES DEBUG ===')
    console.log('Requested Teacher ID:', teacherId, typeof teacherId)
    console.log('All classes in file:', jsonData.classes.map(c => ({id: c.id, name: c.name, teacherId: c.teacherId})))
    console.log('Filtered classes for teacher:', teacherClasses)
    console.log('=== END DEBUG ===')
    
    return { 
      success: true, 
      classes: teacherClasses,
      message: `Found ${teacherClasses.length} classes for teacher ${teacherId}`
    }
    
  } catch (error) {
    console.error('Get classes error:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve classes'
    })
  }
})