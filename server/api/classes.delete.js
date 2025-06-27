import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { classId, teacherId } = body
    
    // Validate input
    if (!classId || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class ID and teacher ID are required'
      })
    }
    
    // Path to your JSON file
    const filePath = path.join(process.cwd(), 'server/data/classes.json')
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Classes database not found'
      })
    }
    
    // Read existing data
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Ensure classes array exists
    if (!jsonData.classes || !Array.isArray(jsonData.classes)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No classes found in database'
      })
    }
    
    // Find the class to delete
    const classIndex = jsonData.classes.findIndex(c => 
      c.id === classId && String(c.teacherId) === String(teacherId)
    )
    
    if (classIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Class not found or you do not have permission to delete it'
      })
    }
    
    // Get class info before deletion for response
    const deletedClass = jsonData.classes[classIndex]
    
    console.log('=== DELETE CLASS DEBUG ===')
    console.log('Teacher ID:', teacherId)
    console.log('Class ID to delete:', classId)
    console.log('Class found at index:', classIndex)
    console.log('Class to delete:', deletedClass)
    console.log('=== END DEBUG ===')
    
    // Remove the class from array
    jsonData.classes.splice(classIndex, 1)
    
    // Write back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
      console.log('✅ Class successfully deleted from file')
    } catch (writeError) {
      console.error('❌ Error writing to file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete class from database'
      })
    }
    
    return { 
      success: true, 
      deletedClass: deletedClass,
      message: `Class "${deletedClass.name}" deleted successfully`,
      remainingClasses: jsonData.classes.filter(c => String(c.teacherId) === String(teacherId)).length
    }
    
  } catch (error) {
    console.error('Delete class error:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete class'
    })
  }
})