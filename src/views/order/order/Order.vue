
<template>
  <page-view class="x-page-order" v-if="invoice" :title="title">
    <a-row slot="headerContent" class="x-header">
      <div class="x-status">
        <div class="x-status-text">{{ statusInfo.longText }}</div>
        <div class="x-status-help">
          {{ invoice.status == 'canceled' ? invoice.cancel_reason : statusInfo.help }}
        </div>
        <div class="x-status-ops" v-if="statusInfo.operations">
          <a-button
            v-for="op in statusInfo.operations"
            :key="op.code"
            :type="op.type"
            @click="$refs.operateOrderForms.operateOrder({order:invoice, op:op})"
          >{{ op.name }}</a-button>
        </div>
        <div class="x-remark">
          商家备注: {{ invoice.remark }}
        </div>
      </div>
    </a-row>
    <a-row v-if="invoice.status != 'canceled'" slot="extra" class="x-progress">
      <a-steps direction="horizontal" :current="statusInfo.step">
        <a-step title="买家下单" :description="invoice.created_at">
        </a-step>
        <a-step title="买家付款" :description="getDateTime('pay_order')">
        </a-step>
        <a-step title="商家发货" :description="getDateTime('ship_order')">
        </a-step>
        <a-step title="交易完成" :description="getDateTime('finish_order')">
        </a-step>
      </a-steps>
    </a-row>

    <a-card :bordered="false" title="物流信息" v-if="shipInfo">
      <div class="x-express" v-if="isShipped">
        <description-list title="包裹">
          <description-item term="发货方式">快递</description-item>
          <description-item term="发货人">{{ getOperationLog('ship_order').operator }}</description-item>
          <description-item term="收货时间">{{ getDateTime('ship_order') }}</description-item>
          <description-item term="" class="x-i-products">
            <div
              v-for="product in invoiceProducts"
              :key="product.id"
              class="x-i-product"
            >
              <div class="x-i-img">
                <img :src="product.thumbnail" />
              </div>
              <div class="x-i-info">
                <div class="x-i-title">{{ product.name }} x{{ product.count }}</div>
              </div>
            </div>
          </description-item>
        </description-list>

        <description-list title="物流">
          <description-item term="物流状态">无物流信息</description-item>
        </description-list>
      </div>
      <div class="x-logistics">
        <description-list title="收货人信息">
          <description-item term="收货人">{{ shipInfo.name }}</description-item>
          <description-item term="联系电话">{{ shipInfo.phone }}</description-item>
          <description-item term="收货地址">{{ shipInfo.area_name }} {{ shipInfo.address }}</description-item>
        </description-list>
        
        <description-list title="配送信息">
          <description-item term="配送方式">快递</description-item>
        </description-list>

        <description-list title="付款信息" v-if="invoice.status == 'wait_pay'">
          <description-item term="付款状态">待付款</description-item>
        </description-list>
        <description-list title="付款信息" v-else-if="invoice.status == 'canceled'">
          <description-item term="应付金额">{{ formatMoney(invoice.final_money) }}</description-item>
        </description-list>
        <description-list title="付款信息" v-else>
          <description-item term="实付金额">{{ formatMoney(invoice.final_money) }}</description-item>
          <description-item term="付款方式">微信支付</description-item>
          <description-item term="付款时间">{{ invoice.payment_time }}</description-item>
        </description-list>

        <description-list title="买家信息">
          <description-item term="买家留言">{{ invoice.message ? invoice.message : '-' }}</description-item>
        </description-list>
      </div>
    </a-card>

    <a-card class="x-trade" :bordered="false" title="交易信息" v-if="shipInfo">
      <a-table
        v-if="invoice"
        ref="table"
        size="default"
        class="x-productTable"
        :rowKey="record => record.id"
        :columns="columns"
        :dataSource="invoiceProducts"
        :pagination="false"
      >
        <div class="x-productHeader" slot="info" slot-scope="text, record">
          <div class="x-i-img">
            <img :src="record.thumbnail" />
          </div>
          <div class="x-i-info">
            <div class="x-i-title"><a href="/product/product" target="_blank">{{ record.name }}</a></div>
          </div>
        </div>

        <div slot="count" slot-scope="text, record">
          <div>{{ record.count }}</div>
        </div>

        <div slot="price" slot-scope="text, record">
          <div>{{ formatMoney(record.price) }}</div>
        </div>

        <div slot="accumulated-money" slot-scope="text, record">
          <div>{{ accumulatedMoney(record) }}</div>
        </div>
      </a-table>

      <div class="x-i-moneyInfo">
        <div>
          <div class="x-i-item">
            <label>商品总价: </label>
            <div>￥ {{ productsPrice }}</div>
          </div>
          <div class="x-i-item">
            <label>运费: </label>
            <div>￥ 0.00</div>
          </div>
          <div class="x-i-item">
            <label>优惠: </label>
            <div>￥ 0.00</div>
          </div>
          <div class="x-i-item">
            <label>金币: </label>
            <div>￥ 0.00</div>
          </div>
          <div class="x-i-item x-i-finalMoney">
            <label>实收金额:</label>
            <div>￥ {{ formatMoney(order.final_money) }}</div>
          </div>
        </div>
      </div>
    </a-card>

    <order-operation-forms ref="operateOrderForms" @change="onFinishOperateOrder"/>

  </page-view>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { OrderStatusInfo } from '../modules/mixin'
import { PageView } from '@/layouts'
import DescriptionList from '@/components/DescriptionList'
import { OrderService } from '@/api/service'
import { formatPrice } from '@/utils/util'
import OrderOperationForms from '../modules/OrderOperationForms'

const DescriptionItem = DescriptionList.Item

export default {
  name: 'Advanced',
  components: {
    PageView,
    DescriptionList,
    DescriptionItem,
    OrderOperationForms
  },
  mixins: [mixinDevice, OrderStatusInfo],
  data () {
    const bid = this.$route.query.bid || ''
    return {
      bid: bid,
      invoice: null,
      order: null,
      
      columns: [{
        title: '商品',
        scopedSlots: { customRender: 'info' }
      }, {
        title: '单价(元)',
        width: '100px',
        scopedSlots: { customRender: 'price' }
      }, {
        title: '数量',
        scopedSlots: { customRender: 'count' },
        width: '100px'
      }, {
        title: '优惠(元)',
        width: '100px',
        scopedSlots: { customRender: 'promotion-money' }
      }, {
        title: '小计(元)',
        width: '100px',
        scopedSlots: { customRender: 'accumulated-money' }
      }]
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    }
  },

  computed: {
    title () {
      return '订单号: ' + this.bid
    },

    shipInfo () {
      if (this.invoice) {
        return this.invoice.ship_info
      } else {
        return {}
      }
    },

    isShipped () {
      const status = this.invoice.status
      return (status === 'shipped') || (status === 'finished')
    },

    invoiceProducts () {
      if (this.invoice) {
        return this.invoice.products
      } else {
        return []
      }
    },

    productsPrice () {
      if (this.invoice) {
        const price = this.invoice.products.reduce((sum, product) => {
          return sum + product.price * product.count
        }, 0)

        return this.formatMoney(price)
      } else {
        return 0
      }
    }
  },

  async mounted () {
    this.order = await OrderService.getOrder(this.bid)
    this.invoice = this.order.invoices[0]
  },

  methods: {
    formatMoney (money) {
      return formatPrice(money)
    },

    accumulatedMoney (product) {
      return formatPrice(product.price * product.count)
    },

    getOperationLog (action) {
      if (!this.order) {
        return ''
      }

      const operationLog = this.order.operation_logs.find(log => {
        console.log(JSON.stringify(log))
        return log.action === action
      })

      return operationLog
    },

    getDateTime (action) {
      if (!this.order) {
        return ''
      }

      const operationLog = this.order.operation_logs.find(log => {
        console.log(JSON.stringify(log))
        return log.action === action
      })
      if (operationLog) {
        return operationLog.created_at
      } else {
        return ''
      }
    },

    async onFinishOperateOrder (data) {
      const { values } = data
      for (const attr in values) {
        this.invoice[attr] = values[attr]
      }
    }
  }
}
</script>

<style lang="less">
.x-page-order {
  .page-header .detail .main .extra {
    margin-left: 0px;
    padding-bottom: 30px;
    flex: 2;
    padding-top: 20px;
    border-top: 1px solid #ebedf0;
    // border-bottom: 1px solid #ebedf0;
    text-align: left;
  }

  .page-header .detail .main .headerContent {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 30px;
    border: 1px solid #ebedf0;
    border-left: none;
    border-bottom: none;

    .ant-btn {
      text-align: left;
      padding-left: 0px;
    }
  }

  .page-header .x-remark {
    margin-top: 20px;
  }

  .x-express {
    display: flex;
    flex-direction: row;
    padding-bottom: 0px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

    .description-list {
      width: 300px;
      .ant-row {
        display: flex;
        flex-direction: column;

        .ant-col-md-8, .ant-col-sm-12, .ant-col-xs-24 {
          width: 100% !important;
        }
      }
    }

    .x-i-product {
      display: inline-block;
      text-align: center;
      margin-right: 5px;

      .x-i-img {
        height: 60px;
        width: 60px;

        img {
          max-width: 60px;
          max-height: 60px;
        }
      }

      .x-i-info {
        line-height: 18px;
        font-size: 12px;
        color: #AAA;
      }
    }
  }

  .x-logistics {
    display: flex;
    flex-direction: row;

    .description-list {
      width: 300px;
      .ant-row {
        display: flex;
        flex-direction: column;

        .ant-col-md-8, .ant-col-sm-12, .ant-col-xs-24 {
          width: 100% !important;
        }
      }
    }
  }

  .x-trade {
    margin-top: 20px;

    .x-productTable .ant-table-thead > tr > th,
    .x-productTable .ant-table-tbody > tr > td {
      padding: 10px;
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
      }
    }

    .x-i-moneyInfo {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      padding-right: 20px;

      .x-i-item {
        width: 200px;
        display: flex;
        flex-direction: row;
        text-align: right;

        label {
          width: 100px;
        }

        div {
          flex: 1;
        }
      }

      .x-i-finalMoney {
        margin-top: 20px;
        font-size: 18px;

        label {
          font-weight: 700;
        }

        div {
          color: #d40000;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
  .x-header {
    
  }
  .x-progress {
    margin: 50px 80px;
  }
  .x-status {
    &-text {
      font-size: 20px;
      font-weight: 700;
      color: #323233;
      line-height: 28px;
    }

    &-help {
      color: #646566;
      margin-top: 15px;
      margin-bottom: 30px;
    }
  }
  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }

  .x-status-ops {
    .ant-btn {
      margin-right: 10px;
    }
  }
</style>
