import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== 'PUT') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    const body = await readBody(event)
    console.log('📝 Update Assignment Request Body:', body)

    const {
      assignmentId,
      assignmentTitle,
      subject,
      chapter,
      teacherId,
      classId
    } = body

    if (!assignmentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Assignment ID is required'
      })
    }

    if (!assignmentTitle || !subject || !chapter || !teacherId || !classId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: assignmentTitle, subject, chapter, teacherId, classId'
      })
    }

    if (body.questions && (!Array.isArray(body.questions) || body.questions.length === 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Questions must be a non-empty array'
      })
    }

    let calculatedMarks = 0
    if (body.questions && body.questions.length > 0) {
      calculatedMarks = body.questions.reduce((total, question) => {
        return total + (parseInt(question.marks) || 0)
      }, 0)
    }

    const updateData = {
      title: assignmentTitle.trim(),
      subject: subject.trim(),
      chapter: chapter.trim(),
      description: body.description?.trim() || '',
      dueDate: body.dueDate || null,
      maxMarks: body.maxMarks || calculatedMarks,
      calculatedMarks: calculatedMarks,
      questions: body.questions || [],
      classId: parseInt(classId),
      teacherId: parseInt(teacherId),
      updatedAt: new Date().toISOString()
    }

    console.log('🔄 Updating assignment with data:', updateData)

    // ✅ Path to assignments JSON (works on Vercel too)
    const filePath = path.join(__dirname, '../data/assignments.json')

    let assignments = []
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      try {
        const jsonData = JSON.parse(fileContent)
        assignments = jsonData.assignments || []
      } catch (e) {
        console.error('❌ Failed to parse assignments file:', e)
        assignments = []
      }
    }

    const assignmentIndex = assignments.findIndex(
      a => a.id === assignmentId && parseInt(a.teacherId) === parseInt(teacherId)
    )

    if (assignmentIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assignment not found or you do not have permission to edit it'
      })
    }

    const original = assignments[assignmentIndex]
    const updatedAssignment = {
      ...original,
      ...updateData,
      id: assignmentId,
      createdAt: original.createdAt,
      submissions: original.submissions || []
    }

    assignments[assignmentIndex] = updatedAssignment
    fs.writeFileSync(filePath, JSON.stringify({ assignments }, null, 2))

    console.log('✅ Assignment updated successfully:', updatedAssignment)

    return {
      success: true,
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    }

  } catch (error) {
    console.error('❌ Error updating assignment:', error)

    if (error.statusCode) {
      throw error
    }

    if (error.code === 'P2025' || error.message?.includes('not found')) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Assignment not found or you do not have permission to edit it'
      })
    }

    if (error.code === 'P2002' || error.message?.includes('unique constraint')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Assignment with this title already exists in the class'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating assignment'
    })
  }
})
