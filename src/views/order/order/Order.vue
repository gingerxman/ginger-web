
<template>
  <page-view class="x-page-order" v-if="invoice" :title="title">
    <a-row slot="headerContent" class="x-header">
      <div class="x-status">
        <div class="x-status-text">{{ statusInfo.text }}</div>
        <div class="x-status-help">
          {{ orderHelp }}
        </div>
        <div class="x-status-ops" v-if="statusInfo.operations">
          <a-button
            v-for="op in statusInfo.operations"
            :key="op.code"
            type="primary"
            @click="$refs.operateOrderForms.operateOrder({order:invoice, op:op})"
          >{{ op.name }}</a-button>
        </div>
      </div>
    </a-row>
    <a-row slot="extra" class="x-progress">
      <a-steps direction="horizontal" :current="curStep">
        <a-step title="买家下单" :description="invoice.created_at">
        </a-step>
        <a-step title="买家付款">
        </a-step>
        <a-step title="商家发货">
        </a-step>
        <a-step title="交易完成">
        </a-step>
      </a-steps>
    </a-row>

    <a-card class="x-logistics" :bordered="false" title="物流信息" v-if="shipInfo">
      <description-list title="收货人信息">
        <description-item term="收货人">{{ shipInfo.name }}</description-item>
        <description-item term="联系电话">{{ shipInfo.phone }}</description-item>
        <description-item term="收货地址">{{ shipInfo.address }}</description-item>
      </description-list>
      
      <description-list title="配送信息">
        <description-item term="配送方式">快递</description-item>
      </description-list>

      <description-list title="付款信息">
        <description-item term="实付金额">{{ formatMoney(invoice.final_money) }}</description-item>
        <description-item term="付款方式">微信支付</description-item>
        <description-item term="付款时间">{{ invoice.payment_time }}</description-item>
      </description-list>

      <description-list title="买家信息">
        <description-item term="买家留言">{{ invoice.message }}</description-item>
      </description-list>
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
            <div>￥ 0.01</div>
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
            <div>￥ {{ accumulatedMoney }}</div>
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

const statusMap = {
  'wait_pay': {
    step: 1,
    text: '等待买家付款'
  },
  'wait_ship': {
    step: 2,
    text: '等待商家发货',
    help: '买家已付款，请尽快发货，否则买家有可能申请退款。',
    operations: [{
      code: 'ship_order',
      name: '发货'
    }]
  },
  'shipped': {
    step: 3,
    text: '商家已发货'
  },
  'canceled': {
    step: 4,
    text: '交易关闭'
  }
}

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

    orderStatus () {
      const statusInfo = statusMap[this.invoice.status]
      if (statusInfo) {
        return statusInfo.text
      } else {
        return '无效订单'
      }
    },

    orderHelp () {
      const statusInfo = statusMap[this.invoice.status]
      if (statusInfo) {
        return statusInfo.help
      } else {
        return ''
      }
    },

    orderOperations () {
      const statusInfo = statusMap[this.invoice.status]
      if (statusInfo) {
        return statusInfo.operations
      } else {
        return []
      }
    },

    curStep () {
      const statusInfo = statusMap[this.invoice.status]
      if (statusInfo) {
        return statusInfo.step
      } else {
        return 1
      }
    },

    shipInfo () {
      if (this.invoice) {
        return this.invoice.ship_info
      } else {
        return {}
      }
    },

    invoiceProducts () {
      if (this.invoice) {
        return this.invoice.products
      } else {
        return []
      }
    }
  },

  async mounted () {
    const order = await OrderService.getOrder(this.bid)
    this.invoice = order.invoices[0]
  },

  methods: {
    formatMoney (money) {
      return formatPrice(money)
    },

    accumulatedMoney (product) {
      return formatPrice(product.price * product.count)
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
  }

  .x-logistics .ant-card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .description-list {
      flex: 1;
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
</style>
