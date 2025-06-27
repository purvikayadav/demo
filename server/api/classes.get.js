import db from '~/server/utils/database'

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
    
    // Get classes for the teacher
    const teacherClasses = await db.getClassesByTeacher(teacherId)
    
    console.log('=== GET CLASSES DEBUG ===')
    console.log('Requested Teacher ID:', teacherId)
    console.log('Found classes:', teacherClasses.length)
    console.log('=== END DEBUG ===')
    
    return { 
      success: true, 
      classes: teacherClasses,
      message: `Found ${teacherClasses.length} classes for teacher ${teacherId}`
    }
    
  } catch (error) {
    console.error('Get classes error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve classes'
    })
  }
})