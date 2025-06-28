
// Fixed Classes DELETE API - server/api/classes.delete.js
import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { classId, teacherId } = body
    
    if (!classId || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class ID and teacher ID are required'
      })
    }

    console.log('🗑️ Deleting class:', classId, 'for teacher:', teacherId)

    // Read existing classes
    const classData = await dataManager.readData('classes.json')
    
    if (!classData.classes || !Array.isArray(classData.classes)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No classes found'
      })
    }

    // Find class to delete
    const classIndex = classData.classes.findIndex(c => 
      c.id === classId && String(c.teacherId) === String(teacherId)
    )
    
    if (classIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Class not found or access denied'
      })
    }

    // Get class info before deletion
    const deletedClass = classData.classes[classIndex]
    
    // Remove from array
    classData.classes.splice(classIndex, 1)
    
    // Save data
    await dataManager.writeData('classes.json', classData)

    console.log('✅ Class deleted successfully')

    return { 
      success: true, 
      deletedClass: deletedClass,
      message: `Class "${deletedClass.name}" deleted successfully`,
      remainingClasses: classData.classes.filter(c => 
        String(c.teacherId) === String(teacherId)
      ).length
    }
    
  } catch (error) {
    console.error('💥 Delete class error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete class: ${error.message}`
    })
  }
})