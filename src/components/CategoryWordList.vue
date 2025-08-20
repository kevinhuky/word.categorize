<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Category Filter Section -->
    <el-card class="mb-4 flex-shrink-0 shadow-lg border-0 rounded-2xl">
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <el-icon size="18" color="white">
                <Collection />
              </el-icon>
            </div>
            <span class="text-lg font-semibold text-gray-800">分类筛选</span>
          </div>
          <div class="flex items-center space-x-2">
            <el-icon size="16" class="text-gray-400">
              <Document />
            </el-icon>
            <span class="text-sm text-gray-500 font-medium">
              共 {{ totalWordCount }} 个单词
            </span>
          </div>
        </div>
        
        <!-- Category Buttons -->
        <div class="flex flex-wrap gap-2">
          <!-- All Categories Button -->
          <el-button
            :type="selectedCategory === null ? 'primary' : 'default'"
            size="default"
            round
            @click="selectCategory(null)"
            class="h-9"
          >
            <span class="font-medium">全部</span>
            <el-tag
              size="small"
              :type="selectedCategory === null ? 'primary' : 'info'"
              class="ml-2"
            >
              {{ totalWordCount }}
            </el-tag>
          </el-button>
          
          <!-- Category Buttons -->
          <div
            v-for="category in categories"
            :key="category"
            class="flex items-center gap-1"
          >
            <el-button
              :type="selectedCategory === category ? 'primary' : 'default'"
              size="default"
              round
              @click="selectCategory(category)"
              class="h-9"
            >
              <span class="font-medium">{{ category }}</span>
              <el-tag
                size="small"
                :type="selectedCategory === category ? 'primary' : 'info'"
                class="ml-2"
              >
                {{ getCategoryWordCount(category) }}
              </el-tag>
            </el-button>
            <el-button
              text
              size="small"
              type="info"
              @click="startEditCategory(category)"
              class="w-6 h-6 p-0 min-w-0"
            >
              <el-icon size="12">
                <Edit />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Words Display Section -->
    <el-card class="flex-1 overflow-hidden shadow-lg border-0 rounded-2xl" body-style="padding: 0; height: 100%; display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <el-icon size="16" color="white">
                <Document />
              </el-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ selectedCategory ? `${selectedCategory}` : '全部单词' }}
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ displayWords.length }} 个单词
              </p>
            </div>
          </div>
          
          <!-- Search Bar -->
          <div style="width: 220px;">
            <el-input
              v-model="searchQuery"
              placeholder="搜索单词..."
              clearable
              size="default"
              class="search-input"
            >
              <template #prefix>
                <el-icon size="16" class="text-gray-400">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredWords.length === 0"
        class="flex-1 flex items-center justify-center"
      >
        <el-empty
          :description="searchQuery ? '没有找到匹配的单词' : (selectedCategory ? '该分类下暂无单词' : '暂无单词')"
        >
          <template #image>
            <el-icon size="100" color="#e6e8eb">
              <Document />
            </el-icon>
          </template>
          <p class="text-sm text-gray-400 mt-2">
            {{ searchQuery ? '尝试调整搜索条件' : (selectedCategory ? '尝试选择其他分类' : '在左侧表单中添加第一个单词吧！') }}
          </p>
        </el-empty>
      </div>

      <!-- Words List Section -->
      <div
        v-else
        class="flex-1 overflow-hidden"
      >
        <el-table
          :data="filteredWords"
          stripe
          size="default"
          height="100%"
          style="width: 100%"
          :row-style="{ height: '60px' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column
            prop="word"
            label="英文单词"
            width="220"
            fixed="left"
          >
            <template #default="scope">
              <div class="flex flex-col py-1">
                <span class="font-mono text-lg font-bold text-blue-600 leading-tight">{{ scope.row.word }}</span>
                <span class="text-xs text-gray-400 mt-1">{{ formatDate(scope.row.createdAt) }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="meaning"
            label="中文释义"
            min-width="250"
          >
            <template #default="scope">
              <div class="text-gray-700 leading-relaxed py-1">
                {{ scope.row.meaning }}
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="category"
            label="分类"
            width="180"
            align="center"
          >
            <template #default="scope">
              <div class="flex items-center justify-center space-x-2">
                <el-tag 
                  :type="getCategoryTagType(scope.row.category)" 
                  size="default"
                  class="px-3 py-1 font-medium"
                  round
                >
                  {{ scope.row.category }}
                </el-tag>
                <el-button
                  text
                  size="small"
                  type="info"
                  @click="startEditCategory(scope.row.category)"
                  class="opacity-60 hover:opacity-100 w-6 h-6 p-0 min-w-0"
                >
                  <el-icon size="12">
                    <Edit />
                  </el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column
            label="操作"
            width="80"
            fixed="right"
            align="center"
          >
            <template #default="scope">
              <el-popconfirm
                :title="`确定要删除单词 '${scope.row.word}' 吗？`"
                @confirm="confirmDelete(scope.row.id)"
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirm-button-type="danger"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    :icon="Delete"
                    circle
                    class="hover:scale-105 transition-transform w-7 h-7"
                  />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- Edit Category Dialog -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑分类名称"
      width="400px"
    >
      <template #header>
        <div class="flex items-center space-x-2">
          <el-icon size="20" color="#18a058">
            <Edit />
          </el-icon>
          <span>编辑分类名称</span>
        </div>
      </template>
      
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-500">
            当前分类: 
            <el-tag type="info" size="small">
              {{ editingCategory }}
            </el-tag>
          </p>
        </div>
        
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editRules"
        >
          <el-form-item
            prop="newName"
            label="新分类名称"
          >
            <el-input
              v-model="editForm.newName"
              placeholder="请输入新的分类名称"
              @keyup.enter="confirmEditCategory"
            />
          </el-form-item>
        </el-form>
        
        <el-alert
          v-if="editingCategory"
          type="info"
          :closable="false"
        >
          该分类下有 {{ getCategoryWordCount(editingCategory) }} 个单词，修改后所有单词的分类都会更新。
        </el-alert>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showEditDialog = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="confirmEditCategory"
          >
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, defineExpose } from 'vue'
import { storageService, dataVersion } from '../services/storageService.js'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'CategoryWordList',
  emits: ['switch-to-add'],
  setup() {
    const words = ref([])
    const categories = ref([])
    const selectedCategory = ref(null)
    const searchQuery = ref('')
    
    // 编辑分类相关状态
    const showEditDialog = ref(false)
    const editingCategory = ref('')
    const editForm = ref({ newName: '' })
    const editFormRef = ref(null)
    
    // 表单验证规则
    const editRules = {
      newName: [
        {
          required: true,
          message: '请输入分类名称',
          trigger: ['input', 'blur']
        },
        {
          min: 1,
          max: 20,
          message: '分类名称长度应在1-20个字符之间',
          trigger: ['input', 'blur']
        },
        {
          validator: (rule, value) => {
            if (value && value.trim() === editingCategory.value) {
              return new Error('新分类名称不能与当前分类相同')
            }
            if (value && storageService.categoryExists(value.trim())) {
              return new Error('该分类名称已存在')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ]
    }

    const displayWords = computed(() => {
      if (selectedCategory.value === null) {
        return words.value
      }
      return words.value.filter(word => word.category === selectedCategory.value)
    })

    const filteredWords = computed(() => {
      if (!searchQuery.value.trim()) {
        return displayWords.value
      }
      
      const query = searchQuery.value.toLowerCase()
      return displayWords.value.filter(word => 
        word.word.toLowerCase().includes(query) ||
        word.meaning.toLowerCase().includes(query) ||
        word.category.toLowerCase().includes(query)
      )
    })

    const totalWordCount = computed(() => words.value.length)

    const loadData = () => {
      console.log('=== CategoryWordList loadData called ===')
      
      try {
        const loadedWords = storageService.getWords()
        const loadedCategories = storageService.getCategories()
        
        console.log('从存储加载的原始数据:', loadedWords)
        console.log('从存储加载的分类:', loadedCategories)
        
        words.value = loadedWords
        categories.value = loadedCategories
        
        console.log('words.value 设置后:', words.value.length, '个单词')
        console.log('categories.value 设置后:', categories.value.length, '个分类')
        console.log('words.value 内容:', words.value)
        
        // 检查计算属性
        console.log('displayWords 计算结果:', displayWords.value.length)
        console.log('filteredWords 计算结果:', filteredWords.value.length)
        
      } catch (error) {
        console.error('LoadData 出错:', error)
      }
      
      console.log('=== CategoryWordList loadData completed ===')
    }

    const selectCategory = (category) => {
      selectedCategory.value = category
      searchQuery.value = ''
    }

    const getCategoryWordCount = (category) => {
      return words.value.filter(word => word.category === category).length
    }

    const getCategoryTagType = (category) => {
      // 为不同分类分配不同的标签颜色
      const tagTypes = ['primary', 'success', 'info', 'warning', 'danger']
      const hash = category.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      return tagTypes[Math.abs(hash) % tagTypes.length]
    }

    const confirmDelete = (wordId) => {
      const success = storageService.deleteWord(wordId)
      if (success) {
        ElMessage.success('单词删除成功')
        loadData() // 重新加载数据
      } else {
        ElMessage.error('删除失败，请重试')
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return '今天'
      } else if (days === 1) {
        return '昨天'
      } else if (days < 7) {
        return `${days}天前`
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit'
        })
      }
    }

    // 编辑分类相关方法
    const startEditCategory = (category) => {
      editingCategory.value = category
      editForm.value.newName = category
      showEditDialog.value = true
    }

    const confirmEditCategory = async () => {
      try {
        await editFormRef.value?.validate()
        
        const oldName = editingCategory.value
        const newName = editForm.value.newName.trim()
        
        const success = storageService.updateCategoryName(oldName, newName)
        
        if (success) {
          ElMessage.success(`分类 "${oldName}" 已成功修改为 "${newName}"`)
          
          // 如果当前选中的分类被修改了，更新选中状态
          if (selectedCategory.value === oldName) {
            selectedCategory.value = newName
          }
          
          // 重新加载数据
          loadData()
          showEditDialog.value = false
        } else {
          ElMessage.error('修改分类失败，请重试')
        }
      } catch (error) {
        // 表单验证失败，不执行任何操作
      }
    }

    onMounted(() => {
      loadData()
    })

    // 监听数据版本变化，自动重新加载数据  
    watch(dataVersion, (newVersion, oldVersion) => {
      console.log('=== Data version changed ===')
      console.log('从', oldVersion, '变更到', newVersion)
      console.log('触发数据重新加载')
      loadData()
    }, { immediate: false })

    // 暴露方法给父组件
    defineExpose({
      loadData
    })

    return {
      words,
      categories,
      selectedCategory,
      searchQuery,
      displayWords,
      filteredWords,
      totalWordCount,
      selectCategory,
      getCategoryWordCount,
      getCategoryTagType,
      loadData,
      dataVersion, // 添加dataVersion用于模板调试显示
      confirmDelete,
      formatDate,
      Delete,
      // 编辑分类相关
      showEditDialog,
      editingCategory,
      editForm,
      editFormRef,
      editRules,
      startEditCategory,
      confirmEditCategory
    }
  }
}
</script>

<style scoped>
.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}
</style>