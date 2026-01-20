<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <main class="flex-1 py-6 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <el-row :gutter="24" class="h-full">
          <!-- 左侧：批量导入 -->
          <el-col :lg="8" class="h-full">
            <el-card class="h-full shadow-lg border-0 rounded-2xl" body-style="padding: 0; height: 100%; display: flex; flex-direction: column;">
              <BatchImport @words-imported="handleWordsImported" />
            </el-card>
          </el-col>

          <!-- 右侧：单词列表 -->
          <el-col :lg="16" class="h-full">
            <div class="h-full">
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