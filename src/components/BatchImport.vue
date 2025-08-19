<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
          <el-icon size="32" color="white">
            <Upload />
          </el-icon>
        </div>
        <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          批量导入
        </h2>
        <p class="text-gray-500">
          上传JSON文件快速导入词汇数据
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 overflow-hidden">
      <div class="h-full flex flex-col space-y-6">
        <!-- Upload Area -->
        <el-upload
          drag
          :show-file-list="false"
          accept=".json"
          :before-upload="handleFileUpload"
          :auto-upload="false"
          class="upload-area"
        >
          <div class="py-8">
            <el-icon size="60" class="text-gray-400 mb-4">
              <Document />
            </el-icon>
            <div class="text-lg font-medium text-gray-700 mb-2">
              点击或拖拽文件到此处
            </div>
            <div class="text-sm text-gray-500">
              仅支持 JSON 格式，最大 10MB
            </div>
          </div>
        </el-upload>

        <!-- Import Preview -->
        <div
          v-if="importPreview.length > 0"
          class="flex-1 flex flex-col overflow-hidden"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              预览数据 ({{ importPreview.length }} 个单词)
            </h3>
            <div class="flex space-x-2">
              <el-button
                size="small"
                @click="clearPreview"
              >
                <template #icon>
                  <el-icon><Close /></el-icon>
                </template>
                清除
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                :loading="isImporting"
                @click="confirmImport"
              >
                <template #icon>
                  <el-icon><Check /></el-icon>
                </template>
                {{ isImporting ? '导入中...' : '确认导入' }}
              </el-button>
            </div>
          </div>
          
          <el-card class="flex-1 overflow-hidden" body-style="padding: 0; height: 100%;">
            <el-scrollbar class="h-full">
              <div class="p-4">
                <div class="space-y-3">
                  <div 
                    v-for="(word, index) in importPreview.slice(0, 50)" 
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="font-mono text-lg font-bold text-gray-900 truncate">
                        {{ word.word }}
                      </div>
                      <div class="text-gray-600 text-sm truncate mt-1">
                        {{ word.meaning }}
                      </div>
                    </div>
                    <el-tag type="info" size="small" class="ml-3 flex-shrink-0">
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
        <div class="flex-shrink-0 space-y-2">
          <el-button
            type="info"
            plain
            size="default"
            @click="showFormatHelp = true"
            class="w-full"
          >
            <template #icon>
              <el-icon><QuestionFilled /></el-icon>
            </template>
            查看JSON格式说明
          </el-button>
          
          <!-- Test Import Button -->
          <el-button
            type="success"
            plain
            size="default"
            @click="testImportWordsJson"
            class="w-full"
          >
            <template #icon>
              <el-icon><Upload /></el-icon>
            </template>
            测试导入 words-import.json
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

    const handleFileUpload = (file) => {
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

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)
          validateAndPreviewWords(jsonData)
        } catch (error) {
          const errorMsg = 'JSON文件格式错误: ' + error.message
          importErrors.value = [errorMsg]
          ElMessage.error(errorMsg)
        }
      }
      reader.readAsText(file)
      return false // 阻止自动上传
    }

    const validateAndPreviewWords = (data) => {
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

      if (validWords.length > 0) {
        importPreview.value = validWords
        ElMessage.success(`已解析 ${validWords.length} 个有效单词`)
      } else {
        ElMessage.error('没有找到有效的单词数据')
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
          const successMsg = `✅ 成功导入 ${successCount} 个单词` + (failCount > 0 ? `，${failCount} 个失败` : '')
          ElMessage.success(successMsg)
          emit('words-imported')
          clearPreview()
        } else {
          ElMessage.error('导入失败，没有成功导入任何单词')
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
        ElMessage.info('正在加载 words-import.json...')
        const response = await fetch('/words-import.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const jsonData = await response.json()
        ElMessage.success('文件加载成功，开始验证数据...')
        validateAndPreviewWords(jsonData)
      } catch (error) {
        ElMessage.error('加载文件失败: ' + error.message)
        console.error('Test import error:', error)
      }
    }

    return {
      importPreview,
      importErrors,
      isImporting,
      showFormatHelp,
      formatExample,
      handleFileUpload,
      confirmImport,
      clearPreview,
      testImportWordsJson
    }
  }
}
</script>