<template>
  <a-card :bordered="false">
    <a-tabs :activeKey="curTab" @change="onChangeTab">
      <a-tab-pane tab="销售中" key="onsale"></a-tab-pane>
      <a-tab-pane tab="已售罄" key="sellout"></a-tab-pane>
      <a-tab-pane tab="仓库中" key="forsale"></a-tab-pane>
    </a-tabs>

    <div class="mb15">
      <a-button type="primary" icon="plus" @click="onClickCreate">发布商品</a-button>
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
      <span :style="{marginRight:'10px'}" v-if="selectedProductKeys.length > 0">已选商品 {{ selectedProductKeys.length }}</span>
      <a-button type="default" @click="onClickCreate">上架</a-button>
    </div>

    <!--  #:rowSelection="{selectedRowKeys: selectedProductKeys, onChange: onSelectProducts}" -->

    <s-table
      ref="table"
      size="middle"
      :rowKey="record => record.id"
      :columns="columns"
      :data="loadProducts"
      :pageSize="10"
      :rowSelection="false"
      :filters="queryParam"
      @change="onChangeTable"
    >
      <div class="x-productHeader" slot="info" slot-scope="text, record">
        <div class="x-i-img">
          <img :src="record.base_info.thumbnail" />
        </div>
        <div class="x-i-info">
          <div class="x-i-title"><a href="/product/product" target="_blank">{{ record.base_info.name }}</a></div>
          <a-tag v-if="record.category" color="orange" class="mt5">{{ record.category.name }}</a-tag>
          <div class="x-i-price mt10">
            <span>￥{{ formatPrice(record) }}</span>
            <span class="x-i-linyPrice" v-if="record.base_info.liny_price > 0">￥{{ formatLinyPrice(record) }}</span>
          </div>
        </div>
      </div>

      <div class="x-visitInfo" slot="visit_info" slot-scope="text, record">
        <div>访客数: {{ record.visit_info.user_count }}</div>
        <div>浏览数: {{ record.visit_info.view_count }}</div>
      </div>

      <span slot="action" slot-scope="text, record">
        <template v-if="record.base_info.shelf_status == 'off_shelf'">
          <a :href="`/product/product?id=${record.id}`" target="_blank">编辑</a>
          <a-divider type="vertical" />
          <a @click.stop="onClickOnShelf(record)">上架</a>
        </template>
        <template v-if="record.base_info.shelf_status == 'on_shelf'">
          <a @click.stop="onClickOffShelf(record)">下架</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { ProductService } from '@/api/service'
import { formatPrice } from '@/utils/util'
import { STable, SortAction } from '@/components'
import Vue from 'vue'

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
  name: 'ProductList',

  components: {
    STable,
    SortAction
  },

  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 当前Tab
      curTab: 'onsale',
      // 新建商品的id
      newPoolProductId: 0,
      // 查询参数
      queryParam: {},
      columns: [{
        title: '商品',
        scopedSlots: { customRender: 'info' }
      }, {
        title: '访问量',
        scopedSlots: { customRender: 'visit_info' },
        width: '120px'
      }, {
        title: '库存',
        dataIndex: 'skus[0].stocks',
        width: '80px'
      }, {
        title: '总销量',
        dataIndex: 'sold_count',
        width: '80px'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '140px',
        scopedSlots: { customRender: 'action' }
      }],
      loading: false,
      products: [],
      selectedProductKeys: [],
      selectedProducts: []
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
    const productTab = Vue.ls.get('__product_tab')
    if (productTab) {
      this.curTab = productTab
      Vue.ls.remove('__product_tab')
      this.newPoolProductId = Vue.ls.get('__new_pool_product_id')
      Vue.ls.remove('__new_pool_product_id')
    }
    console.log("in ProductList created")
  },

  async mounted () {
    console.log("in ProductList mounted")
  },

  methods: {
    formatPrice (record) {
      return formatPrice(record.skus[0].price)
    },

    formatLinyPrice (record) {
      return formatPrice(record.base_info.liny_price)
    },

    loadProducts (parameter) {
      console.log("load products")
      // parameter.filters = { ...parameter.filters, ...{ '__f-status-equal': this.curTab } }
      const productType = this.curTab
      return ProductService.getProducts(productType, parameter)
    },

    async onChangeTab (activeKey) {
      this.curTab = activeKey
      this.$refs.table.refresh()
    },

    onChangeTable (page, event) {
      console.warn(page)
    },

    onSelectProducts (selectedRowKeys, selectedRows) {
      this.selectedProductKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },

    onClickCreate () {
      this.$router.push({
        path: '/product/product',
        query: {
        }
      })
    },

    async onClickOnShelf (product) {
      try {
        await ProductService.putProductsOnShelf([product])
        this.$message.success('上架成功!')
        this.$refs.table.refresh()
      } catch (e) {
        this.$message.error('上架失败!')
      }
    },

    async onClickOffShelf (product) {
      try {
        await ProductService.putProductsOffShelf([product])
        this.$message.success('下架成功!')
        this.$refs.table.refresh()
      } catch (e) {
        this.$message.error('下架失败!')
      }
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
  .x-productHeader {
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
        font-size: 14px;
        line-height: 14px;
        color: #f60;

        .x-i-linyPrice {
          font-size: 12px;
          text-decoration: line-through;
          color: #AFAFAF;
          margin-left: 5px;
        }
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
