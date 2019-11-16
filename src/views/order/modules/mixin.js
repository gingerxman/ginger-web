const statusMap = {
  'wait_pay': {
    step: 1,
    text: '等待买家付款',
    operations: [{
      code: 'cancel_order',
      name: '取消订单'
    }]
  },
  'wait_ship': {
    step: 2,
    text: '等待商家发货',
    help: '买家已付款，请尽快发货，否则买家有可能申请退款。',
    operations: [{
      code: 'ship_invoice',
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

const OrderStatusInfo = {
  computed: {
    statusInfo: function () {
      let order = this.invoice
      if (!order) {
        order = this.order
      }
      return statusMap[order.status]
    }
  },

  methods: {

  }
}

export { OrderStatusInfo }
