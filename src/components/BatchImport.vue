<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-3">
          <el-icon size="28" color="white">
            <Upload />
          </el-icon>
        </div>
        <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
          批量导入
        </h2>
        <p class="text-sm text-gray-500">
          上传JSON文件快速导入词汇数据
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-5 overflow-hidden">
      <div class="h-full flex flex-col space-y-5">
        <!-- Upload Area -->
        <el-upload
          drag
          :show-file-list="false"
          accept=".json"
          :on-change="handleFileChange"
          :auto-upload="false"
          :limit="1"
          class="upload-area rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
        >
          <div class="py-6 px-4">
            <div class="flex flex-col items-center">
              <el-icon size="48" class="text-blue-400 mb-3">
                <Document />
              </el-icon>
              <div class="text-base font-bold text-gray-800 mb-1 text-center">
                📁 点击或拖拽JSON文件到此处
              </div>
              <div class="text-xs text-gray-500 text-center mb-2">
                仅支持 JSON 格式，最大 10MB
              </div>
              <div class="text-xs text-blue-600 text-center">
                💡 或者点击下方"一键导入示例数据"快速体验
              </div>
            </div>
          </div>
        </el-upload>

        <!-- Import Preview -->
        <div
          v-if="importPreview.length > 0"
          class="flex-1 flex flex-col overflow-hidden"
        >
          <div class="flex justify-between items-center mb-3 px-1">
            <h3 class="text-base font-semibold text-gray-800">
              预览数据 ({{ importPreview.length }} 个单词)
            </h3>
            <div class="flex space-x-2">
              <el-button
                size="small"
                @click="clearPreview"
                class="px-3"
              >
                <template #icon>
                  <el-icon size="14"><Close /></el-icon>
                </template>
                清除
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                :loading="isImporting"
                @click="confirmImport"
                class="px-3"
              >
                <template #icon>
                  <el-icon size="14"><Check /></el-icon>
                </template>
                {{ isImporting ? '导入中...' : '确认导入' }}
              </el-button>
            </div>
          </div>
          
          <el-card class="flex-1 overflow-hidden rounded-xl border-0 shadow-sm" body-style="padding: 0; height: 100%;">
            <el-scrollbar class="h-full">
              <div class="p-3">
                <div class="space-y-2">
                  <div 
                    v-for="(word, index) in importPreview.slice(0, 50)" 
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
                  >
                    <div class="flex-1 min-w-0 mr-3">
                      <div class="font-mono text-base font-bold text-blue-700 truncate">
                        {{ word.word }}
                      </div>
                      <div class="text-gray-600 text-sm truncate mt-0.5">
                        {{ word.meaning }}
                      </div>
                    </div>
                    <el-tag type="primary" size="small" class="flex-shrink-0">
                      {{ word.category }}
                    </el-tag>
                  </div>
                  
                  <div
                    v-if="importPreview.length > 50"
                    class="text-center py-4 text-gray-500"
                  >
                    还有 {{ importPreview.length - 50 }} 个单词...
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-card>
        </div>

        <!-- Import Errors -->
        <el-alert
          v-if="importErrors.length > 0"
          type="error"
          title="导入错误"
          :closable="false"
          show-icon
        >
          <div class="max-h-32 overflow-y-auto">
            <div class="space-y-1">
              <div
                v-for="error in importErrors.slice(0, 10)"
                :key="error"
                class="text-sm"
              >
                {{ error }}
              </div>
              <div
                v-if="importErrors.length > 10"
                class="text-sm text-gray-500"
              >
                还有 {{ importErrors.length - 10 }} 个错误...
              </div>
            </div>
          </div>
        </el-alert>

        <!-- Format Help -->
        <div class="flex-shrink-0 space-y-2 mt-auto pt-2">
          <el-button
            type="info"
            plain
            size="small"
            @click="showFormatHelp = true"
            class="w-full h-10"
          >
            <template #icon>
              <el-icon size="16"><QuestionFilled /></el-icon>
            </template>
            <span class="text-sm">查看JSON格式说明</span>
          </el-button>
          
          <!-- Test Import Button -->
          <el-button
            type="success"
            plain
            size="small"
            @click="testImportWordsJson"
            class="w-full h-10"
          >
            <template #icon>
              <el-icon size="16"><Upload /></el-icon>
            </template>
            <span class="text-sm">🚀 一键导入示例数据</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- JSON格式说明弹窗 -->
    <el-dialog
      v-model="showFormatHelp"
      title="JSON格式说明"
      width="900px"
      :center="true"
    >
      <template #header>
        <div class="flex items-center space-x-2">
          <el-icon size="20" color="#409eff">
            <Document />
          </el-icon>
          <span class="text-lg font-semibold">JSON格式说明</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-6">
        <!-- 左侧：必填字段和示例格式 -->
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-blue-800 mb-2">📋 必填字段</h4>
            <div class="grid grid-cols-1 gap-2 text-sm">
              <div class="flex items-center space-x-3">
                <el-tag size="small" type="primary">word</el-tag>
                <span class="text-gray-700">英文单词（必填）</span>
              </div>
              <div class="flex items-center space-x-3">
                <el-tag size="small" type="success">meaning</el-tag>
                <span class="text-gray-700">中文释义（必填）</span>
              </div>
              <div class="flex items-center space-x-3">
                <el-tag size="small" type="warning">category</el-tag>
                <span class="text-gray-700">词汇分类（必填）</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-800 mb-2">💡 示例格式</h4>
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{{ formatExample }}</pre>
            </div>
          </div>
        </div>

        <!-- 右侧：注意事项和支持功能 -->
        <div class="space-y-4">
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-amber-800 mb-2">⚠️ 注意事项</h4>
            <ul class="text-sm text-amber-700 space-y-1">
              <li>• 文件必须是有效的JSON格式</li>
              <li>• 最外层必须是数组 [ ]</li>
              <li>• 每个对象必须包含word、meaning、category三个字段</li>
              <li>• 文件大小限制：10MB</li>
              <li>• 重复单词会自动跳过</li>
            </ul>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-green-800 mb-2">✅ 支持功能</h4>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• 中英文混合内容</li>
              <li>• 自动去除前后空格</li>
              <li>• 详细的错误提示</li>
              <li>• 导入前预览确认</li>
            </ul>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <el-button type="primary" @click="showFormatHelp = false">
            我知道了
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Word } from '../models/Word.js'
import { storageService } from '../services/storageService.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'BatchImport',
  emits: ['words-imported'],
  setup(props, { emit }) {
    const importPreview = ref([])
    const importErrors = ref([])
    const isImporting = ref(false)
    const showFormatHelp = ref(false)

    const formatExample = `[
  {
    "word": "example",
    "meaning": "例子，实例", 
    "category": "日常用语"
  },
  {
    "word": "hello",
    "meaning": "你好",
    "category": "日常用语"
  },
  {
    "word": "computer",
    "meaning": "计算机",
    "category": "科技术语"
  }
]`

    const handleFileChange = (file, fileList) => {
      console.log('=== handleFileChange called ===')
      console.log('File object:', file)
      console.log('File raw:', file.raw)
      console.log('File status:', file.status)
      
      // 清空文件列表以避免累积
      fileList.splice(0, fileList.length)
      
      if (file.raw) {
        processFile(file.raw)
      } else if (file) {
        // 如果没有raw属性，直接使用file
        processFile(file)
      }
    }

    const processFile = (file) => {
      console.log('=== processFile called ===')
      console.log('File name:', file.name)
      console.log('File size:', file.size)
      console.log('File type:', file.type)
      
      ElMessage.info(`📁 正在处理文件: ${file.name}`)
      
      if (!file.name.endsWith('.json')) {
        importErrors.value = ['请选择JSON格式文件']
        ElMessage.error('请选择JSON格式文件')
        return false
      }

      // 检查文件大小（10MB限制）
      if (file.size > 10 * 1024 * 1024) {
        importErrors.value = ['文件大小不能超过10MB']
        ElMessage.error('文件大小不能超过10MB')
        return false
      }

      ElMessage.info('📖 正在读取文件内容...')
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          console.log('File content length:', e.target.result.length)
          console.log('File content preview:', e.target.result.substring(0, 200) + '...')
          
          const jsonData = JSON.parse(e.target.result)
          console.log('JSON parsed successfully, array length:', jsonData.length)
          
          ElMessage.success(`✅ 文件读取成功！开始验证 ${jsonData.length} 个条目`)
          validateAndPreviewWords(jsonData)
        } catch (error) {
          console.error('JSON parse error:', error)
          const errorMsg = 'JSON文件格式错误: ' + error.message
          importErrors.value = [errorMsg]
          ElMessage.error(errorMsg)
        }
      }
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        ElMessage.error('文件读取失败')
      }
      
      reader.readAsText(file)
      return false // 阻止自动上传
    }

    const validateAndPreviewWords = (data) => {
      console.log('=== validateAndPreviewWords called ===')
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      console.log('Data length:', data?.length)
      console.log('Data sample:', data?.slice(0, 2))
      
      importErrors.value = []
      importPreview.value = []

      if (!Array.isArray(data)) {
        const errorMsg = 'JSON文件必须包含一个数组'
        importErrors.value = [errorMsg]
        ElMessage.error(errorMsg)
        return
      }

      if (data.length === 0) {
        const errorMsg = 'JSON数组不能为空'
        importErrors.value = [errorMsg]
        ElMessage.error(errorMsg)
        return
      }

      const validWords = []
      const errors = []

      data.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`第${index + 1}项: 必须是对象`)
          return
        }

        if (!item.word || typeof item.word !== 'string' || !item.word.trim()) {
          errors.push(`第${index + 1}项: 缺少有效的word字段`)
          return
        }

        if (!item.meaning || typeof item.meaning !== 'string' || !item.meaning.trim()) {
          errors.push(`第${index + 1}项: 缺少有效的meaning字段`)
          return
        }

        if (!item.category || typeof item.category !== 'string' || !item.category.trim()) {
          errors.push(`第${index + 1}项: 缺少有效的category字段`)
          return
        }

        validWords.push({
          word: item.word.trim(),
          meaning: item.meaning.trim(),
          category: item.category.trim()
        })
      })

      if (errors.length > 0) {
        importErrors.value = errors
      }

      console.log('Validation completed:')
      console.log('- Valid words count:', validWords.length)
      console.log('- Errors count:', errors.length)
      console.log('- Valid words sample:', validWords.slice(0, 3))
      console.log('- Errors sample:', errors.slice(0, 3))

      if (validWords.length > 0) {
        importPreview.value = validWords
        console.log('importPreview.value set to:', importPreview.value.length, 'words')
        ElMessage.success(`✅ 已解析 ${validWords.length} 个有效单词，准备预览`)
      } else {
        ElMessage.error('❌ 没有找到有效的单词数据')
      }
    }

    const confirmImport = async () => {
      if (importPreview.value.length === 0) return

      isImporting.value = true
      let successCount = 0
      let failCount = 0
      const errors = []

      try {
        for (const wordData of importPreview.value) {
          try {
            const word = new Word(wordData)
            const validation = word.validate()
            
            if (!validation.isValid) {
              errors.push(`${wordData.word}: ${validation.errors.join(', ')}`)
              failCount++
              continue
            }

            const success = storageService.addWord(word)
            if (success) {
              successCount++
            } else {
              errors.push(`${wordData.word}: 保存失败`)
              failCount++
            }
          } catch (error) {
            errors.push(`${wordData.word}: ${error.message}`)
            failCount++
          }
        }

        if (successCount > 0) {
          const successMsg = `🎉 成功导入 ${successCount} 个单词！` + (failCount > 0 ? ` (${failCount} 个失败)` : '')
          ElMessage({
            message: successMsg,
            type: 'success',
            duration: 3000,
            showClose: true
          })
          emit('words-imported')
          clearPreview()
          
          // 额外提示用户查看右侧列表
          setTimeout(() => {
            ElMessage({
              message: '👉 请查看右侧单词列表，新导入的词汇已添加！',
              type: 'info',
              duration: 4000
            })
          }, 1000)
        } else {
          ElMessage.error('❌ 导入失败，没有成功导入任何单词')
        }

        if (errors.length > 0) {
          importErrors.value = errors.slice(0, 10) // 只显示前10个错误
        } else {
          importErrors.value = []
        }

      } catch (error) {
        ElMessage.error('导入过程出错: ' + error.message)
      } finally {
        isImporting.value = false
      }
    }

    const clearPreview = () => {
      importPreview.value = []
      importErrors.value = []
      ElMessage.info('已清除预览数据')
    }

    const testImportWordsJson = async () => {
      try {
        ElMessage.info('🔄 正在加载示例数据...')
        const response = await fetch('/words-import.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const jsonData = await response.json()
        ElMessage.success(`✅ 示例文件加载成功！包含 ${jsonData.length} 个单词`)
        validateAndPreviewWords(jsonData)
      } catch (error) {
        ElMessage.error('❌ 加载示例文件失败: ' + error.message)
        console.error('Test import error:', error)
        
        // 提供备选方案
        ElMessage({
          message: '💡 提示：您也可以创建自己的JSON文件进行导入',
          type: 'info',
          duration: 4000
        })
      }
    }

    return {
      importPreview,
      importErrors,
      isImporting,
      showFormatHelp,
      formatExample,
      processFile,
      handleFileChange,
      confirmImport,
      clearPreview,
      testImportWordsJson
    }
  }
}
</script>

<style scoped>
.upload-area :deep(.el-upload-dragger) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.upload-area :deep(.el-upload-dragger.is-dragover) {
  border-color: #409eff;
  background-color: #ecf5ff;
}
</style>