// Fixed Classes API - server/api/classes.get.js
import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { teacherId } = query
    
    if (!teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Teacher ID is required'
      })
    }

    console.log('📚 Loading classes for teacher:', teacherId)
    console.log('🌍 Environment:', dataManager.getEnvironmentInfo())

    // Read classes data
    const classData = await dataManager.readData('classes.json')
    
    // Ensure classes array exists
    if (!classData.classes) {
      classData.classes = []
    }

    // Filter by teacher ID
    const teacherClasses = classData.classes.filter(c => 
      String(c.teacherId) === String(teacherId)
    )

    console.log('✅ Found classes:', teacherClasses.length)

    return { 
      success: true, 
      classes: teacherClasses,
      message: `Found ${teacherClasses.length} classes`,
      environment: dataManager.getEnvironmentInfo()
    }
    
  } catch (error) {
    console.error('💥 Get classes error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to retrieve classes: ${error.message}`
    })
  }
})