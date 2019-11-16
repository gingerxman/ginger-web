<template>
  <page-view title="订单查询">
    <a-card :bordered="false">
      <a-tabs defaultActiveKey="all" @change="onChangeTab" class="x-tabs">
        <a-tab-pane key="all">
          <a-badge slot="tab">
            <div class="x-i-tab">
              全部
            </div>
          </a-badge>
        </a-tab-pane>
        <a-tab-pane key="wait_pay">
          <a-badge slot="tab">
            <div class="x-i-tab">
              待付款
            </div>
          </a-badge>
        </a-tab-pane>
        <a-tab-pane key="wait_ship">
          <a-badge slot="tab">
            <div class="x-i-tab">
              待发货
            </div>
          </a-badge>
        </a-tab-pane>
        <a-tab-pane key="shipped">
          <a-badge slot="tab">
            <div class="x-i-tab">
              已发货
            </div>
          </a-badge>
        </a-tab-pane>
        <a-tab-pane key="finished">
          <a-badge slot="tab">
            <div class="x-i-tab">
              已完成
            </div>
          </a-badge>
        </a-tab-pane>
        <a-tab-pane key="canceled">
          <a-badge slot="tab">
            <div class="x-i-tab">
              已关闭
            </div>
          </a-badge>
        </a-tab-pane>
      </a-tabs>

      <div class="x-orderList">
        <div class="list-header">
          <div class="list-header-item goods-cell">商品</div>
          <div class="list-header-item price-cell">单价(元) / 数量</div>
          <div class="list-header-item aftermarket-cell">售后</div>
          <div class="list-header-item customer-cell">买家 / 收货人</div>
          <div class="list-header-item express-cell">配送方式</div>
          <div class="list-header-item pay-price-cell">实收金额(元)</div>
          <div class="list-header-item state-cell">订单状态</div>
          <div class="list-header-item operation-cell">操作</div>
        </div>
        <div class="list-body">
          <order-card
            v-for="invoice in invoices"
            :key="invoice.bid"
            :order="invoice"
            @operation="$refs.operateOrderForms.operateOrder"
          />
        </div>
        <a-pagination
          v-model="pageinfo.curPage"
          :total="pageinfo.total"
          :pageSize="pageinfo.pageSize"
          :defaultPageSize="pageinfo.pageSize"
          showQuickJumper
          :showTotal="total => `总共 ${total} 单`"
          @change="onChangePage"
        />
      </div>
    </a-card>

    <order-operation-forms ref="operateOrderForms" @change="onFinishOperateOrder"/>
  </page-view>
</template>

<script>
import moment from 'moment'
import { OrderService } from '@/api/service'
import { formatPrice, newPageInfo } from '@/utils/util'
import OrderCard from './modules/OrderCard'
import { PageView } from '@/layouts'
import OrderOperationForms from '../modules/OrderOperationForms'

export default {
  name: 'Orders',
  
  components: {
    OrderOperationForms,
    OrderCard,
    PageView
  },

  data () {
    this.activeOrderBid = null
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 当前Tab
      curTab: 'all',
      // 查询参数
      queryParam: {},
      loading: false,
      invoices: [],
      activeInvoice: null,
      pageinfo: newPageInfo(4)
    }
  },
  
  created () {
  },

  async mounted () {
    await this.loadOrders()
  },

  methods: {
    formatPrice (record) {
      return formatPrice(record.skus[0].price)
    },

    getInvoiceByBid (bid) {
      return this.invoices.find(invoice => invoice.bid === bid)
    },

    onFinishOperateOrder (data) {
      const { bid, values } = data
      const invoice = this.getInvoiceByBid(bid)
      for (const attr in values) {
        invoice[attr] = values[attr]
      }
    },

    async loadOrders () {
      const invoiceStatus = this.curTab
      const { invoices } = await OrderService.getInvoices(invoiceStatus, this.pageinfo)
      this.invoices = invoices
    },

    async onChangeTab (activeKey) {
      this.curTab = activeKey
      await this.loadOrders()
    },

    async onChangePage (page) {
      this.pageinfo.updateCurPage(page)
      await this.loadOrders()
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
  .x-tabs {
    .x-i-tab {
      padding-top: 5px;
      padding-right: 5px;
    }
  }
  .table-page-search-wrapper {
    background: #f8f8f8 !important;
    padding: 20px 10px 1px;
  }
  .table-operator {
    margin-bottom: 5px;
    margin-top: 20px;
  }
  .x-orderList {
    .list-header {
      font-weight: 500;
      display: -ms-flexbox;
      display: flex;
      background-color: #f7f8fa;
      border-radius: 1px;
      margin-bottom: 16px;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 1;
      color: #323233;

      .list-header-item {
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
        white-space: nowrap;
      }

      .goods-cell {
        flex-grow: 1;
        text-align: left;
      }

      .price-cell {
        width: 10%;
        text-align: right;
      }

      .aftermarket-cell {
        width: 10%;
      }

      .customer-cell {
        width: 10%;
        min-width: 105px;
        word-break: break-all;
      }

      .express-cell {
        width: 10%;
      }

      .pay-price-cell {
        width: 10%;
      }

      .state-cell {
        width: 10%;
      }

      .operation-cell {
        width: 10%;
        text-align: right;
      }
    }

    .list-body {
      min-height: 100px;
    }
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
        font-size: 12px;
        line-height: 14px;
        color: #f60;
      }
    }
  }

  .ant-table-tbody > tr > td {
    background-color: red !important;
  }
  .ant-pagination {
    text-align: right;
  }
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
