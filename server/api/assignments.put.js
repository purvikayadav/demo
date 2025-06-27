// server/api/assignments.put.js
// PUT endpoint for updating assignments

export default defineEventHandler(async (event) => {
  try {
    // Only allow PUT method
    if (getMethod(event) !== 'PUT') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Parse request body
    const body = await readBody(event)
    console.log('📝 Update Assignment Request Body:', body)

    // Validate required fields
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

    // Validate questions if provided
    if (body.questions && (!Array.isArray(body.questions) || body.questions.length === 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Questions must be a non-empty array'
      })
    }

    // Calculate total marks from questions
    let calculatedMarks = 0
    if (body.questions && body.questions.length > 0) {
      calculatedMarks = body.questions.reduce((total, question) => {
        return total + (parseInt(question.marks) || 0)
      }, 0)
    }

    // Prepare update data
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

    // Here you would typically update in your database
    // For demonstration, I'm showing the structure you'd use with different ORMs:

    /* 
    // Example with Prisma:
    const updatedAssignment = await prisma.assignment.update({
      where: { 
        id: parseInt(assignmentId),
        teacherId: parseInt(teacherId) // Security: ensure teacher owns the assignment
      },
      data: updateData
    })
    */

    /* 
    // Example with Mongoose:
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { 
        _id: assignmentId, 
        teacherId: parseInt(teacherId) 
      },
      updateData,
      { new: true }
    )
    */

    /*
    // Example with raw SQL:
    const [updatedRows] = await db.execute(`
      UPDATE assignments 
      SET title = ?, subject = ?, chapter = ?, description = ?, 
          dueDate = ?, maxMarks = ?, calculatedMarks = ?, 
          questions = ?, updatedAt = ?
      WHERE id = ? AND teacherId = ?
    `, [
      updateData.title,
      updateData.subject, 
      updateData.chapter,
      updateData.description,
      updateData.dueDate,
      updateData.maxMarks,
      updateData.calculatedMarks,
      JSON.stringify(updateData.questions),
      updateData.updatedAt,
      parseInt(assignmentId),
      parseInt(teacherId)
    ])
    */

    // Mock response for demonstration
    // In real implementation, replace this with actual database update
    const mockUpdatedAssignment = {
      id: parseInt(assignmentId),
      ...updateData,
      createdAt: new Date().toISOString(), // This would come from DB
      submissions: [] // This would come from DB
    }

    console.log('✅ Assignment updated successfully:', mockUpdatedAssignment)

    // Return success response
    return {
      success: true,
      message: 'Assignment updated successfully',
      assignment: mockUpdatedAssignment
    }

  } catch (error) {
    console.error('❌ Error updating assignment:', error)

    // Handle specific errors
    if (error.statusCode) {
      throw error
    }

    // Handle database errors
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

    // Generic error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating assignment'
    })
  }
})

// Alternative file structure if you're using a single assignments.js file:
/*
// server/api/assignments.js
export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  switch (method) {
    case 'GET':
      return handleGetAssignments(event)
    case 'POST':
      return handleCreateAssignment(event)
    case 'PUT':
      return handleUpdateAssignment(event)
    case 'DELETE':
      return handleDeleteAssignment(event)
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
  }
})

async function handleUpdateAssignment(event) {
  // Same update logic as above
}
*/