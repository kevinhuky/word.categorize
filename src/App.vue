<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo Section -->
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <el-icon class="text-white" size="24">
                <Collection />
              </el-icon>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LexiSort
              </h1>
              <p class="text-xs text-gray-500">
                智能词汇分类系统
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2 text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
              <el-icon class="text-blue-600" size="16">
                <CircleCheck />
              </el-icon>
              <span class="font-medium text-blue-700">{{ totalWords }}</span>
              <span class="text-blue-600">个词汇</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600 bg-purple-50 px-3 py-1.5 rounded-lg">
              <el-icon class="text-purple-600" size="16">
                <Collection />
              </el-icon>
              <span class="font-medium text-purple-700">{{ totalCategories }}</span>
              <span class="text-purple-600">个分类</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <el-row :gutter="24">
          <!-- 左侧：批量导入 -->
          <el-col :lg="8">
            <el-card class="h-[calc(100vh-8rem)]" body-style="padding: 0; height: 100%; display: flex; flex-direction: column;">
              <BatchImport @words-imported="handleWordsImported" />
            </el-card>
          </el-col>

          <!-- 右侧：单词列表 -->
          <el-col :lg="16">
            <div style="height: calc(100vh - 8rem);">
              <CategoryWordList 
                :key="wordListKey"
                ref="wordListRef"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import BatchImport from './components/BatchImport.vue'
import CategoryWordList from './components/CategoryWordList.vue'
import { storageService, dataVersion } from './services/storageService.js'

export default {
  name: 'App',
  components: {
    BatchImport,
    CategoryWordList
  },
  setup() {
    const wordListRef = ref(null)
    const wordListKey = ref(0)

    const totalWords = computed(() => {
      // 依赖 dataVersion 确保响应性
      dataVersion.value
      const count = storageService.getWords().length
      console.log('App totalWords 计算:', count, 'dataVersion:', dataVersion.value)
      return count
    })

    const totalCategories = computed(() => {
      // 依赖 dataVersion 确保响应性
      dataVersion.value
      const count = storageService.getCategories().length
      console.log('App totalCategories 计算:', count, 'dataVersion:', dataVersion.value)
      return count
    })

    const handleWordsImported = () => {
      console.log('=== handleWordsImported called ===')
      console.log('Current dataVersion:', dataVersion.value)
      
      // 强制刷新单词列表组件
      wordListKey.value++
      console.log('wordListKey incremented to:', wordListKey.value)
      
      // 手动触发数据重载（备用方案）
      setTimeout(() => {
        if (wordListRef.value && wordListRef.value.loadData) {
          console.log('手动调用 wordList.loadData()')
          wordListRef.value.loadData()
        }
      }, 100)
      
      console.log('=== handleWordsImported completed ===')
    }

    return {
      wordListRef,
      wordListKey,
      totalWords,
      totalCategories,
      handleWordsImported
    }
  }
}
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>