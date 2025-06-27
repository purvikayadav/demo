import fs from 'fs'
import path from 'path'

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
        statusMessage: 'Assignment title, subject, chapter, class ID, teacher ID, and questions are required'
      })
    }
    
    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one question is required'
      })
    }
    
    // Path to assignments JSON file
    // const filePath = path.join(process.cwd(), 'server/data/assignments.json')
    const filePath = path.join(__dirname, '../data/assignments.json')

    
    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    // Read existing data or create new structure
    let jsonData
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      try {
        jsonData = JSON.parse(fileContent)
        if (!jsonData.assignments || !Array.isArray(jsonData.assignments)) {
          jsonData.assignments = []
        }
      } catch (parseError) {
        console.error('Error parsing assignments file, creating new structure:', parseError)
        jsonData = { assignments: [] }
      }
    } else {
      jsonData = { assignments: [] }
    }
    
    // Generate unique assignment ID
    const assignmentId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Process questions and calculate total marks
    let totalMarks = 0
    const processedQuestions = questions.map((question, index) => {
      const questionMarks = parseInt(question.marks) || 1
      totalMarks += questionMarks
      
      return {
        id: `q_${index + 1}`,
        questionText: question.questionText,
        questionType: question.questionType, // 'multiple-choice', 'short-answer', 'long-answer', 'true-false'
        marks: questionMarks,
        required: question.required || true,
        options: question.options || [], // For multiple choice questions
        correctAnswer: question.correctAnswer || null, // For auto-grading
        order: index + 1
      }
    })
    
    // Create new assignment
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
      status: 'active', // 'active', 'draft', 'closed'
      submissions: [], // Will store student submissions
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('=== ASSIGNMENT CREATION DEBUG ===')
    console.log('Teacher ID:', teacherId)
    console.log('Class ID:', classId)
    console.log('Assignment being created:', {
      id: newAssignment.id,
      title: newAssignment.title,
      subject: newAssignment.subject,
      questionsCount: newAssignment.questions.length,
      totalMarks: newAssignment.calculatedMarks
    })
    console.log('=== END DEBUG ===')
    
    jsonData.assignments.push(newAssignment)
    
    // Write back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2))
      console.log('✅ Assignment successfully saved to file')
    } catch (writeError) {
      console.error('❌ Error writing to file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save assignment to database'
      })
    }
    
    return { 
      success: true, 
      assignment: newAssignment,
      message: 'Assignment created successfully'
    }
    
  } catch (error) {
    console.error('Assignment creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create assignment'
    })
  }
})