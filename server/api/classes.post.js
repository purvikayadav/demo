// Fixed Classes POST API - server/api/classes.post.js
import dataManager from '~/utils/dataManager.js'

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

    console.log('🏫 Creating class:', className, 'for teacher:', teacherId)

    // Read existing classes
    const classData = await dataManager.readData('classes.json')
    
    // Ensure classes array exists
    if (!classData.classes) {
      classData.classes = []
    }

    // Check for duplicate
    const existingClass = classData.classes.find(c => 
      c.name.toLowerCase() === className.toLowerCase() && 
      String(c.teacherId) === String(teacherId)
    )
    
    if (existingClass) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class with this name already exists'
      })
    }

    // Create new class
    const getClassIcon = (name) => {
      const classNumber = name.toLowerCase().match(/\d+/)
      return classNumber ? `mdi-numeric-${classNumber[0]}-box` : 'mdi-school'
    }

    const classId = `${className.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}_${teacherId}_${Date.now()}`
    
    const newClass = {
      id: classId,
      name: className.trim(),
      icon: getClassIcon(className),
      studentCount: parseInt(studentCount),
      teacherId: String(teacherId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to array
    classData.classes.push(newClass)

    // Save data
    await dataManager.writeData('classes.json', classData)

    console.log('✅ Class created successfully:', classId)

    return { 
      success: true, 
      class: newClass,
      message: 'Class created successfully'
    }
    
  } catch (error) {
    console.error('💥 Create class error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create class: ${error.message}`
    })
  }
})
