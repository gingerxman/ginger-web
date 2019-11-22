<template>
  <a-card :bordered="false" class="x-page-customers">
    <div class="mb15">
      <a-button type="primary" icon="plus" @click="onClickAddTag">添加客户</a-button>
    </div>
    
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model="queryParam.id" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span :style="{marginRight:'10px'}" v-if="selectedKeys.length > 0">已选客户 {{ selectedKeys.length }}</span>
      <a-button type="default" @click="onClickAddTag">加标签</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      :rowKey="record => record.user.id"
      :columns="columns"
      :dataSource="customers"
      :pagination="pagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedKeys, onChange: onSelectCustomers}"
      @change="onChangeTable"
    >
      <div class="x-user" slot="user" slot-scope="text, record">
        <div class="x-i-img">
          <img :src="record.user.avatar" />
        </div>
        <div class="x-i-info">
          <div class="x-i-title"><a :href="`/crm/customer?user_id=${record.user.id}`" target="_blank">{{ record.user.name }}</a></div>
        </div>
      </div>

      <span slot="consume_money" slot-scope="text, record">
        {{ formatMoney(record.consume_money) }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a-button type="link" @click.stop="onClickAddTag(record)">加标签</a-button>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { CustomerService } from '@/api/service'
import { formatPrice } from '@/utils/util'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'Customers',
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,

      // 查询参数
      queryParam: {},
      columns: [{
        title: '客户',
        scopedSlots: { customRender: 'user' }
      }, {
        title: '积分',
        dataIndex: 'points',
        width: '80px'
      }, {
        title: '储值余额',
        dataIndex: 'gcoin',
        width: '100px'
      }, {
        title: '购买次数',
        dataIndex: 'consume_count',
        width: '100px'
      }, {
        title: '购买金额',
        scopedSlots: { customRender: 'consume_money' },
        width: '100px'
      }, {
        title: '上次消费时间',
        dataIndex: 'latest_consume_time',
        width: '200px'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '100px',
        scopedSlots: { customRender: 'action' }
      }],
      pagination: {
        current: 1,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 20,
        pageSizeOptions: ['10', '20', '30', '40']
      },
      loading: false,
      customers: [],
      selectedKeys: [],
      selectedCustomers: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
  },

  async mounted () {
    await this.loadCustomers()
  },

  methods: {
    formatMoney (money) {
      return formatPrice(money)
    },

    async loadCustomers () {
      const { customers, pageinfo } = await CustomerService.getCustomers()
      this.customers = customers
      console.log(pageinfo)
      this.pagination = { ...this.pagination,
        page: 1,
        total: 10
      }
    },

    onChangeTable (page, event) {
      console.warn(page)
    },

    onSelectCustomers (selectedRowKeys, selectedRows) {
      this.selectedKeys = selectedRowKeys
      this.selectedCustomers = selectedRows
    },

    onClickAddTag (customer) {
      alert('add tag for ' + customer.user.name)
    },

    handleOk () {
      this.$refs.table.refresh()
    },
    
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
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
  .x-user {
    padding-right: 10px;
    margin-left: -8px;
    .x-i-img {
      width: 80px;
      height: 60px;
      float: left;
      text-align: center;
      vertical-align: middle;
      display: table-cell;

      img {
        max-width: 60px;
        max-height: 60px;
        vertical-align: middle;
      }
    }

    .x-i-info {
      line-height: 18px;
      margin-left: 70px;

      .x-i-title a {
        color: #38f;
        cursor: pointer;
      }

      .x-i-price {
        margin-top: 5px;
        vertical-align: middle;
        font-size: 12px;
        line-height: 14px;
        color: #f60;
      }
    }
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
