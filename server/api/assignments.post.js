// Fixed Assignments POST API - server/api/assignments.post.js
import dataManager from '~/utils/dataManager.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      assignmentTitle,
      subject,
      chapter,
      description,
      dueDate,
      maxMarks,
      questions,
      classId,
      teacherId 
    } = body
    
    // Validate required fields
    if (!assignmentTitle || !subject || !chapter || !classId || !teacherId || !questions) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }
    
    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one question is required'
      })
    }

    console.log('📝 Creating assignment:', assignmentTitle)

    // Read existing assignments
    const assignmentData = await dataManager.readData('assignments.json')
    
    // Ensure assignments array exists
    if (!assignmentData.assignments) {
      assignmentData.assignments = []
    }

    // Generate unique ID
    const assignmentId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Process questions and calculate marks
    let totalMarks = 0
    const processedQuestions = questions.map((question, index) => {
      const questionMarks = parseInt(question.marks) || 1
      totalMarks += questionMarks
      
      return {
        id: `q_${index + 1}`,
        questionText: question.questionText,
        questionType: question.questionType,
        marks: questionMarks,
        required: question.required || true,
        options: question.options || [],
        correctAnswer: question.correctAnswer || null,
        order: index + 1
      }
    })
    
    // Create assignment object
    const newAssignment = {
      id: assignmentId,
      title: assignmentTitle.trim(),
      subject: subject.trim(),
      chapter: chapter.trim(),
      description: description?.trim() || '',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      maxMarks: parseInt(maxMarks) || totalMarks,
      calculatedMarks: totalMarks,
      questions: processedQuestions,
      classId: String(classId),
      teacherId: String(teacherId),
      status: 'active',
      submissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to array
    assignmentData.assignments.push(newAssignment)
    
    // Save data
    await dataManager.writeData('assignments.json', assignmentData)

    console.log('✅ Assignment created successfully:', assignmentId)

    return { 
      success: true, 
      assignment: newAssignment,
      message: 'Assignment created successfully'
    }
    
  } catch (error) {
    console.error('💥 Create assignment error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create assignment: ${error.message}`
    })
  }
})
