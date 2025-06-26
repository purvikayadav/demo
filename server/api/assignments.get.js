import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { classId, teacherId } = query
    
    // Validate input
    if (!classId || !teacherId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Class ID and teacher ID are required'
      })
    }
    
    // Path to assignments JSON file
    const filePath = path.join(process.cwd(), 'server/data/assignments.json')
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { 
        success: true, 
        assignments: [],
        message: 'No assignments found'
      }
    }
    
    // Read existing data
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Ensure assignments array exists
    if (!jsonData.assignments || !Array.isArray(jsonData.assignments)) {
      return { 
        success: true, 
        assignments: [],
        message: 'No assignments array found'
      }
    }
    
    // Filter assignments by class and teacher
    const classAssignments = jsonData.assignments.filter(assignment => 
      String(assignment.classId) === String(classId) && 
      String(assignment.teacherId) === String(teacherId)
    )
    
    console.log('=== GET ASSIGNMENTS DEBUG ===')
    console.log('Requested Class ID:', classId)
    console.log('Requested Teacher ID:', teacherId)
    console.log('Found assignments:', classAssignments.length)
    console.log('=== END DEBUG ===')
    
    return { 
      success: true, 
      assignments: classAssignments,
      message: `Found ${classAssignments.length} assignments`
    }
    
  } catch (error) {
    console.error('Get assignments error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve assignments'
    })
  }
})