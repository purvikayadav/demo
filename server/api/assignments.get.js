// Fixed Assignments GET API - server/api/assignments.get.js
import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { classId, teacherId } = query
    
    if (!classId || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class ID and teacher ID are required'
      })
    }

    console.log('📋 Loading assignments for class:', classId, 'teacher:', teacherId)

    // Read assignments data
    const assignmentData = await dataManager.readData('assignments.json')
    
    // Ensure assignments array exists
    if (!assignmentData.assignments) {
      assignmentData.assignments = []
    }

    // Filter assignments
    const classAssignments = assignmentData.assignments.filter(assignment => 
      String(assignment.classId) === String(classId) && 
      String(assignment.teacherId) === String(teacherId)
    )

    console.log('✅ Found assignments:', classAssignments.length)

    return { 
      success: true, 
      assignments: classAssignments,
      message: `Found ${classAssignments.length} assignments`
    }
    
  } catch (error) {
    console.error('💥 Get assignments error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to retrieve assignments: ${error.message}`
    })
  }
})
