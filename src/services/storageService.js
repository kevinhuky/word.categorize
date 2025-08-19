import { ref } from 'vue'

// 响应式的数据版本号，用于触发组件更新
export const dataVersion = ref(0)

// 本地存储服务
class StorageService {
  constructor() {
    this.STORAGE_KEY = 'wordCategorizeData'
  }

  // 触发数据更新
  updateDataVersion() {
    dataVersion.value++
    console.log('Data version updated to:', dataVersion.value)
  }

  // 获取所有单词
  getWords() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取数据失败:', error)
      return []
    }
  }

  // 保存单词列表
  saveWords(words) {
    console.log('=== SaveWords called ===')
    console.log('Attempting to save', words.length, 'words')
    console.log('localStorage available:', typeof Storage !== 'undefined')
    
    try {
      const jsonString = JSON.stringify(words)
      console.log('JSON string length:', jsonString.length)
      console.log('JSON string preview:', jsonString.substring(0, 200) + '...')
      
      localStorage.setItem(this.STORAGE_KEY, jsonString)
      console.log('localStorage.setItem completed')
      
      // 验证数据确实被保存了
      const savedData = localStorage.getItem(this.STORAGE_KEY)
      console.log('Verification: data retrieved from localStorage:', savedData ? 'EXISTS' : 'NULL')
      
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        console.log('Verification: parsed data length:', parsedData.length)
      }
      
      this.updateDataVersion() // 触发数据更新
      console.log('Data version updated')
      
      console.log('=== SaveWords completed successfully ===')
      return true
    } catch (error) {
      console.error('=== SaveWords failed ===')
      console.error('Error details:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      return false
    }
  }

  // 添加单词
  addWord(word) {
    console.log('=== StorageService.addWord called ===')
    console.log('Input word:', JSON.stringify(word, null, 2))
    
    try {
      const words = this.getWords()
      console.log('Current words count before adding:', words.length)
      
      const wordData = word.toJSON()
      console.log('Word data to save:', JSON.stringify(wordData, null, 2))
      
      words.push(wordData)
      console.log('Words array after push, count:', words.length)
      
      const result = this.saveWords(words)
      console.log('SaveWords result:', result)
      
      if (result) {
        const verifyWords = this.getWords()
        console.log('Verification: words count after save:', verifyWords.length)
        console.log('Verification: last saved word:', JSON.stringify(verifyWords[verifyWords.length - 1], null, 2))
      }
      
      console.log('=== StorageService.addWord completed ===')
      return result
    } catch (error) {
      console.error('Error in StorageService.addWord:', error)
      return false
    }
  }

  // 删除单词
  deleteWord(wordId) {
    const words = this.getWords()
    const filteredWords = words.filter(word => word.id !== wordId)
    return this.saveWords(filteredWords)
  }

  // 获取所有分类
  getCategories() {
    const words = this.getWords()
    const categories = [...new Set(words.map(word => word.category))]
    return categories.filter(category => category.trim() !== '')
  }

  // 根据分类获取单词
  getWordsByCategory(category) {
    const words = this.getWords()
    return words.filter(word => word.category === category)
  }

  // 修改分类名称
  updateCategoryName(oldName, newName) {
    if (!oldName || !newName || oldName.trim() === '' || newName.trim() === '') {
      return false
    }
    
    const words = this.getWords()
    const updatedWords = words.map(word => {
      if (word.category === oldName) {
        return { ...word, category: newName }
      }
      return word
    })
    
    return this.saveWords(updatedWords)
  }

  // 检查分类名称是否已存在
  categoryExists(categoryName) {
    const categories = this.getCategories()
    return categories.includes(categoryName)
  }
}

export const storageService = new StorageService()