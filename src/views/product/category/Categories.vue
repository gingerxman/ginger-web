<template>
  <a-card :bordered="false">
    <div class="mb15">
      <a-button type="primary" icon="plus" @click="onClickCreate">添加类目</a-button>
    </div>

    <s-table
      ref="table"
      size="middle"
      :rowKey="record => record.id"
      :columns="columns"
      :data="loadCategories"
      :pageSize="99999"
      :showPagination="false"
      :rowSelection="false"
      :loading="loading"
    >
      <div slot="is_enable" slot-scope="text, record">
        <a-badge :status="record | statusTypeFilter" :text="record | statusFilter" />
      </div>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-popconfirm v-if="record.is_enabled" title="禁用后，手机用户将看不到该类目，确认吗？" @confirm="onClickDisable(record)"><a>禁用</a></a-popconfirm>
          <a-popconfirm v-if="!record.is_enabled" title="启用后，手机用户将看到该类目，确认吗？" @confirm="onClickEnable(record)"><a>启用</a></a-popconfirm>
          <a-divider type="vertical" />
          <a @click="onClickEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <!-- <a-popconfirm title="确认删除吗？" @confirm="onClickDelete(record)"><a>删除</a></a-popconfirm> -->
          <!-- <a-divider type="vertical" /> -->
          <sort-action :value="record" @change="onClickMove" />
        </template>
      </span>
    </s-table>

    <edit-category-form ref="editCategoryModal" @ok="onFinishEditCategory" />
  </a-card>
</template>

<script>
import { ProductCategoryService } from '@/api/service'
import EditCategoryForm from './modules/EditCategoryForm'
import { STable, SortAction } from '@/components'

const statusMap = {
  false: {
    status: 'default',
    text: '已禁用'
  },
  true: {
    status: 'success',
    text: '已启用'
  }
}

export default {
  components: {
    STable,
    EditCategoryForm,
    SortAction
  },

  data () {
    return {
      // 查询参数
      queryParam: {},
      columns: [{
        title: '商品类目',
        dataIndex: 'name'
      }, {
        title: '状态',
        scopedSlots: { customRender: 'is_enable' },
        width: '120px'
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '160px'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '210px',
        scopedSlots: { customRender: 'action' }
      }],
      loading: false
    }
  },
  filters: {
    statusFilter (record) {
      return statusMap[record.is_enabled].text
    },
    statusTypeFilter (record) {
      return statusMap[record.is_enabled].status
    }
  },
  created () {
  },

  async mounted () {
  },

  methods: {
    async loadCategories () {
      return ProductCategoryService.getCategories()
    },

    onClickCreate () {
      this.$refs.editCategoryModal.show(null)
    },

    onClickEdit (category) {
      console.log(category, 'category')
      this.$refs.editCategoryModal.show(category)
    },

    async onFinishEditCategory (data) {
      const { id, name } = data
      if (id === 0) {
        const isSuccess = await ProductCategoryService.createCategory(name)
        if (!isSuccess) {
          this.$message.error('创建分类失败!')
        }
        setTimeout(() => {
          this.$refs.editCategoryModal.close()
        }, 500)

        this.$refs.table.refresh()
      } else {
        const isSuccess = await ProductCategoryService.updateCategory(id, name)
        if (!isSuccess) {
          this.$message.error('更新分类失败!')
        }
        setTimeout(() => {
          this.$refs.editCategoryModal.close()
        }, 500)

        this.$refs.table.refresh()
      }
    },

    async onClickDisable (record) {
      const isSuccess = ProductCategoryService.disable(record.id)
      if (isSuccess) {
        record.is_enabled = false
      } else {
        this.$message.error('操作失败!')
      }
    },

    async onClickEnable (record) {
      const isSuccess = ProductCategoryService.enable(record.id)
      if (isSuccess) {
        record.is_enabled = true
      } else {
        this.$message.error('操作失败!')
      }
    },
    async onClickDelete (record) {
      const isSuccess = ProductCategoryService.delete(record.id)
      if (isSuccess) {
        setTimeout(() => {
          this.$refs.table.refresh()
        }, 500)
      } else {
        this.$message.error('删除失败!')
      }
    },
    async onClickMove (data) {
      var category = data.value
      var action = data.action
      await ProductCategoryService.updateDisplayIndex(category.id, action)
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
  .table-page-search-wrapper {
    background: #f8f8f8 !important;
    padding: 20px 10px 1px;
  }
  .table-operator {
    margin-bottom: 5px;
    margin-top: 20px;
  }

  .ant-table-tbody > tr > td {
    background-color: red !important;
  }
  // tr:hover:not(.ant-table-expanded-row) > td {
  //   background-color: red !important;
  // }
</style>
<style lang="less">
  .ant-table-tbody > tr > td {
    .x-i-hoverDisplay {
      visibility: hidden;
    }
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    .x-i-hoverDisplay {
      visibility: visible;
    }
  }
</style>
