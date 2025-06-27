import db from '~/server/utils/database'

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
    
    // Delete the class
    const deletedClass = await db.deleteClass(classId, teacherId)
    
    console.log('=== DELETE CLASS DEBUG ===')
    console.log('Teacher ID:', teacherId)
    console.log('Class ID to delete:', classId)
    console.log('Class deleted:', deletedClass)
    console.log('=== END DEBUG ===')
    
    return { 
      success: true, 
      deletedClass: deletedClass,
      message: `Class "${deletedClass.name}" deleted successfully`
    }
    
  } catch (error) {
    console.error('Delete class error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.message.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete class'
    })
  }
})