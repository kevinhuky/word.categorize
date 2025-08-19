// 简化的单词模型
export class Word {
  constructor(data = {}) {
    console.log('Word constructor called with:', data)
    try {
      this.id = data.id || this.generateId()
      this.word = data.word || ''
      this.meaning = data.meaning || ''
      this.category = data.category || ''
      this.createdAt = data.createdAt || new Date().toISOString()
      console.log('Word constructed successfully:', this)
    } catch (error) {
      console.error('Error in Word constructor:', error)
      throw error
    }
  }

  generateId() {
    try {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    } catch (error) {
      console.error('Error generating ID:', error)
      return 'id_' + Date.now()
    }
  }

  // 验证数据
  validate() {
    console.log('Word validate called for:', this)
    const errors = []
    
    try {
      if (!this.word || !this.word.trim || !this.word.trim()) {
        errors.push('单词不能为空')
      }
      
      if (!this.meaning || !this.meaning.trim || !this.meaning.trim()) {
        errors.push('释义不能为空')
      }
      
      if (!this.category || !this.category.trim || !this.category.trim()) {
        errors.push('分类不能为空')
      }

      const result = {
        isValid: errors.length === 0,
        errors
      }
      
      console.log('Word validation result:', result)
      return result
    } catch (error) {
      console.error('Error in Word validate:', error)
      return {
        isValid: false,
        errors: ['验证过程出错: ' + error.message]
      }
    }
  }

  // 转换为JSON
  toJSON() {
    try {
      const result = {
        id: this.id,
        word: this.word,
        meaning: this.meaning,
        category: this.category,
        createdAt: this.createdAt
      }
      console.log('Word toJSON result:', result)
      return result
    } catch (error) {
      console.error('Error in Word toJSON:', error)
      throw error
    }
  }

  // 从JSON创建实例
  static fromJSON(json) {
    try {
      return new Word(json)
    } catch (error) {
      console.error('Error in Word fromJSON:', error)
      throw error
    }
  }
}