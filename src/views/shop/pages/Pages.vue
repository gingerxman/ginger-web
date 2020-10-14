<template>
  <a-card :bordered="false" class="x-page-pagesPage">
    <div class="mb15">
      <a-button type="primary" icon="plus" @click="onClickCreate">新建微页面</a-button>
    </div>
    
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.name__contains" placeholder=""/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- <div class="table-operator">
      <span :style="{marginRight:'10px'}" v-if="selectedProductKeys.length > 0">已选商品 {{ selectedProductKeys.length }}</span>
      <a-button v-if="curTab === 'onsale'" type="default" @click="onClickBatchOffShelf">下架</a-button>
      <a-button v-if="curTab === 'forsale'" type="default" @click="onClickBatchOnShelf">上架</a-button>
    </div> -->

    <!-- <s-table
      ref="table"
      size="middle"
      :rowKey="record => record.id"
      :columns="columns"
      :data="loadProducts"
      :pageSize="20"
      :rowSelection="{onChange: onSelectProducts}"
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
    </s-table> -->
  </a-card>
</template>

<script>
import moment from 'moment'
import { ProductService } from '@/api/service'
import { STable, SortAction } from '@/components'
import Vue from 'vue'

export default {
  name: 'Pages',

  components: {
    STable,
    SortAction
  },

  data () {
    return {
      // 当前Tab
      curTab: 'onsale',
      // 新建商品的id
      newPoolProductId: 0,
      // 查询参数
      queryParam: this.defaultQueryParam(),

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
      pages: [],
    }
  },
  
  filters: {
  },

  created () {
  },

  async mounted () {
    console.log("in Pages mounted")
  },

  methods: {
    loadPages (parameter) {
      console.log("load pages")
      console.log(parameter)
      // const productType = this.curTab
      // return ProductService.getProducts(productType, parameter)
    },

    onSelectProducts (selectedRowKeys, selectedRows) {
      this.selectedProductKeys = selectedRowKeys
      this.selectedProducts = selectedRows
    },

    onClickCreate () {
      this.$router.push({
        path: '/shop/page',
        query: {
        }
      })
    },

    async onClickSetHomePage (page) {
      alert('设为主页')
    },

    resetSearchForm () {
      this.queryParam = this.defaultQueryParam()
    },

    defaultQueryParam () {
      const param = {
      }

      return param
    },

    async handleSearch () {
      alert('search')
      // this.$refs.table.refresh()
    },
  }
}
</script>

<style lang="less" scoped>
  .table-page-search-wrapper {
    background: #f8f8f8 !important;
    padding: 20px 15px 1px 15px;
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
.x-page-pagesPage {
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

  .table-page-search-wrapper .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 100px;
  }
}
</style>
