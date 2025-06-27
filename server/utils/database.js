// server/utils/database.js
import { kv } from '@vercel/kv'

class Database {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.kvEnabled = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  }

  // Users methods
  async getUsers() {
    if (this.isProduction && this.kvEnabled) {
      const users = await kv.get('users') || []
      return Array.isArray(users) ? users : []
    }
    
    // Development fallback - in memory storage
    return global.__dev_users || []
  }

  async saveUsers(users) {
    if (this.isProduction && this.kvEnabled) {
      await kv.set('users', users)
      return true
    }
    
    // Development fallback
    global.__dev_users = users
    return true
  }

  async findUserByContact(contactNo) {
    const users = await this.getUsers()
    return users.find(u => u.contactNo === contactNo)
  }

  async createUser(userData) {
    const users = await this.getUsers()
    
    // Check if user already exists
    const existingUser = users.find(u => u.contactNo === userData.contactNo)
    if (existingUser) {
      throw new Error('User with this contact number already exists')
    }
    
    const newUser = {
      id: Date.now(),
      ...userData,
      registeredAt: new Date().toISOString(),
      lastLogin: null
    }
    
    users.push(newUser)
    await this.saveUsers(users)
    
    return newUser
  }

  async updateUser(userId, updateData) {
    const users = await this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    users[userIndex] = { ...users[userIndex], ...updateData }
    await this.saveUsers(users)
    
    return users[userIndex]
  }

  // Classes methods
  async getClasses() {
    if (this.isProduction && this.kvEnabled) {
      const classes = await kv.get('classes') || []
      return Array.isArray(classes) ? classes : []
    }
    
    return global.__dev_classes || []
  }

  async saveClasses(classes) {
    if (this.isProduction && this.kvEnabled) {
      await kv.set('classes', classes)
      return true
    }
    
    global.__dev_classes = classes
    return true
  }

  async getClassesByTeacher(teacherId) {
    const classes = await this.getClasses()
    return classes.filter(c => String(c.teacherId) === String(teacherId))
  }

  async createClass(classData) {
    const classes = await this.getClasses()
    
    // Check if class already exists for this teacher
    const existing = classes.find(c => 
      c.name.toLowerCase() === classData.name.toLowerCase() && 
      String(c.teacherId) === String(classData.teacherId)
    )
    
    if (existing) {
      throw new Error('Class with this name already exists for this teacher')
    }
    
    const newClass = {
      id: `${classData.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}_${classData.teacherId}_${Date.now()}`,
      ...classData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    classes.push(newClass)
    await this.saveClasses(classes)
    
    return newClass
  }

  async deleteClass(classId, teacherId) {
    const classes = await this.getClasses()
    const classIndex = classes.findIndex(c => 
      c.id === classId && String(c.teacherId) === String(teacherId)
    )
    
    if (classIndex === -1) {
      throw new Error('Class not found or you do not have permission to delete it')
    }
    
    const deletedClass = classes[classIndex]
    classes.splice(classIndex, 1)
    await this.saveClasses(classes)
    
    return deletedClass
  }

  // Assignments methods
  async getAssignments() {
    if (this.isProduction && this.kvEnabled) {
      const assignments = await kv.get('assignments') || []
      return Array.isArray(assignments) ? assignments : []
    }
    
    return global.__dev_assignments || []
  }

  async saveAssignments(assignments) {
    if (this.isProduction && this.kvEnabled) {
      await kv.set('assignments', assignments)
      return true
    }
    
    global.__dev_assignments = assignments
    return true
  }

  async getAssignmentsByClassAndTeacher(classId, teacherId) {
    const assignments = await this.getAssignments()
    return assignments.filter(a => 
      String(a.classId) === String(classId) && 
      String(a.teacherId) === String(teacherId)
    )
  }

  async createAssignment(assignmentData) {
    const assignments = await this.getAssignments()
    
    const newAssignment = {
      id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assignmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    assignments.push(newAssignment)
    await this.saveAssignments(assignments)
    
    return newAssignment
  }

  async updateAssignment(assignmentId, updateData, teacherId) {
    const assignments = await this.getAssignments()
    const assignmentIndex = assignments.findIndex(a => 
      a.id === assignmentId && String(a.teacherId) === String(teacherId)
    )
    
    if (assignmentIndex === -1) {
      throw new Error('Assignment not found or you do not have permission to edit it')
    }
    
    assignments[assignmentIndex] = {
      ...assignments[assignmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    await this.saveAssignments(assignments)
    return assignments[assignmentIndex]
  }
}

// Create singleton instance
const db = new Database()
export default db