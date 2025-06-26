import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { className, studentCount, teacherId } = body
    
    // Validate input
    if (!className || !studentCount || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class name, student count, and teacher ID are required'
      })
    }
    
    // Path to your JSON file
    const filePath = path.join(process.cwd(), 'server/data/classes.json')
    
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
        // Ensure classes array exists
        if (!jsonData.classes || !Array.isArray(jsonData.classes)) {
          jsonData.classes = []
        }
      } catch (parseError) {
        console.error('Error parsing existing file, creating new structure:', parseError)
        jsonData = { classes: [] }
      }
    } else {
      jsonData = { classes: [] }
    }
    
    // Generate class icon based on class name
    const getClassIcon = (name) => {
      const classNumber = name.toLowerCase().match(/\d+/)
      if (classNumber) {
        return `mdi-numeric-${classNumber[0]}-box`
      }
      return 'mdi-school'
    }
    
    // Generate unique class ID
    const generateClassId = (name, tId) => {
      const baseName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
      return `${baseName}_${tId}_${Date.now()}`
    }
    
    // Check if class already exists for this teacher
    const classId = generateClassId(className, teacherId)
    const existingClass = jsonData.classes.find(c => 
      c.name.toLowerCase() === className.toLowerCase() && 
      String(c.teacherId) === String(teacherId)
    )
    
    if (existingClass) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class with this name already exists for this teacher'
      })
    }
    
    // Add new class
    const newClass = {
      id: classId,
      name: className.trim(),
      icon: getClassIcon(className),
      studentCount: parseInt(studentCount),
      teacherId: String(teacherId), // Ensure teacherId is stored as string
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('=== CLASS CREATION DEBUG ===')
    console.log('Teacher ID received:', teacherId, typeof teacherId)
    console.log('New class being saved:', newClass)
    console.log('Current classes in file:', jsonData.classes.length)
    console.log('=== END DEBUG ===')
    
    jsonData.classes.push(newClass)
    
    // Write back to file with error handling
    try {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
      console.log('✅ Class successfully saved to file')
    } catch (writeError) {
      console.error('❌ Error writing to file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save class to database'
      })
    }
    
    return { 
      success: true, 
      class: newClass,
      message: 'Class created successfully'
    }
    
  } catch (error) {
    console.error('Class creation error:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create class'
    })
  }
})