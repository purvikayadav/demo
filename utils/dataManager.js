// utils/dataManager.js - Create this utility file
import fs from 'fs'
import path from 'path'

class DataManager {
  constructor() {
    this.isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
    this.dataDir = this.isServerless ? '/tmp' : path.join(process.cwd(), 'server/data')
    
    // In-memory fallback for serverless
    this.memoryStorage = {
      users: [],
      classes: [],
      assignments: []
    }
  }

  // Safe file read with fallbacks
  async readData(filename) {
    try {
      // Try reading from file first
      const filePath = path.join(this.dataDir, filename)
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
      }
      
      // Fallback to memory storage
      const key = filename.replace('.json', '')
      return { [key]: this.memoryStorage[key] || [] }
      
    } catch (error) {
      console.error(`Error reading ${filename}:`, error)
      
      // Return default structure
      const key = filename.replace('.json', '')
      return { [key]: [] }
    }
  }

  // Safe file write with fallbacks
  async writeData(filename, data) {
    try {
      // Try writing to file
      const filePath = path.join(this.dataDir, filename)
      
      // Ensure directory exists
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      return true
      
    } catch (error) {
      console.warn(`File write failed for ${filename}, using memory storage:`, error.message)
      
      // Fallback to memory storage
      const key = filename.replace('.json', '')
      if (data[key]) {
        this.memoryStorage[key] = data[key]
      }
      
      return true
    }
  }

  // Environment detection
  getEnvironmentInfo() {
    return {
      isServerless: this.isServerless,
      platform: process.env.VERCEL ? 'Vercel' : process.env.NETLIFY ? 'Netlify' : 'Unknown',
      dataDir: this.dataDir,
      nodeEnv: process.env.NODE_ENV
    }
  }
}

export default new DataManager()
