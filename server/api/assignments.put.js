// Fixed Assignments PUT API - server/api/assignments.put.js
import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== 'PUT') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    const body = await readBody(event)
    const { 
      assignmentId, 
      assignmentTitle, 
      subject, 
      chapter, 
      teacherId, 
      classId,
      description,
      dueDate,
      maxMarks,
      questions
    } = body

    // Validate required fields
    if (!assignmentId || !assignmentTitle || !subject || !chapter || !teacherId || !classId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    console.log('✏️ Updating assignment:', assignmentId)

    // Read existing assignments
    const assignmentData = await dataManager.readData('assignments.json')
    
    if (!assignmentData.assignments) {
      assignmentData.assignments = []
    }

    // Find assignment to update
    const assignmentIndex = assignmentData.assignments.findIndex(a => 
      a.id === assignmentId && String(a.teacherId) === String(teacherId)
    )
    
    if (assignmentIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assignment not found or access denied'
      })
    }

    // Calculate marks from questions
    let calculatedMarks = 0
    if (questions && questions.length > 0) {
      calculatedMarks = questions.reduce((total, question) => {
        return total + (parseInt(question.marks) || 0)
      }, 0)
    }

    // Update assignment
    const existingAssignment = assignmentData.assignments[assignmentIndex]
    
    assignmentData.assignments[assignmentIndex] = {
      ...existingAssignment,
      title: assignmentTitle.trim(),
      subject: subject.trim(),
      chapter: chapter.trim(),
      description: description?.trim() || '',
      dueDate: dueDate || null,
      maxMarks: maxMarks || calculatedMarks,
      calculatedMarks: calculatedMarks,
      questions: questions || existingAssignment.questions,
      classId: String(classId),
      teacherId: String(teacherId),
      updatedAt: new Date().toISOString()
    }

    // Save data
    await dataManager.writeData('assignments.json', assignmentData)

    console.log('✅ Assignment updated successfully')

    return {
      success: true,
      message: 'Assignment updated successfully',
      assignment: assignmentData.assignments[assignmentIndex]
    }

  } catch (error) {
    console.error('💥 Update assignment error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update assignment: ${error.message}`
    })
  }
})
