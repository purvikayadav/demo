import db from '~/server/utils/database'

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
    
    // Generate class icon based on class name
    const getClassIcon = (name) => {
      const classNumber = name.toLowerCase().match(/\d+/)
      if (classNumber) {
        return `mdi-numeric-${classNumber[0]}-box`
      }
      return 'mdi-school'
    }
    
    // Create new class
    const newClass = await db.createClass({
      name: className.trim(),
      icon: getClassIcon(className),
      studentCount: parseInt(studentCount),
      teacherId: String(teacherId)
    })
    
    console.log('=== CLASS CREATION DEBUG ===')
    console.log('Teacher ID received:', teacherId)
    console.log('New class created:', newClass)
    console.log('=== END DEBUG ===')
    
    return { 
      success: true, 
      class: newClass,
      message: 'Class created successfully'
    }
    
  } catch (error) {
    console.error('Class creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    if (error.message.includes('already exists')) {
      throw createError({
        statusCode: 409,
        statusMessage: error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create class'
    })
  }
})