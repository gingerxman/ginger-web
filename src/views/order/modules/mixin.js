const statusMap = {
  'wait_pay': {
    step: 1,
    text: '等待买家付款',
    longText: '商品已拍下，等待买家付款',
    help: '如买家未在规定时间内付款，订单将按照设置逾期自动关闭。',
    operations: [{
      type: 'link',
      code: 'cancel_order',
      name: '取消订单',
      enable_in_list: true
    }, {
      type: 'link',
      code: 'remark_order',
      name: '备注',
      enable_in_list: false
    }]
  },
  'wait_ship': {
    step: 2,
    text: '等待商家发货',
    longText: '等待商家发货',
    help: '买家已付款，请尽快发货，否则买家有可能申请退款。',
    operations: [{
      type: 'primary',
      code: 'ship_invoice',
      name: '发货',
      enable_in_list: true
    }]
  },
  'shipped': {
    step: 3,
    text: '商家已发货',
    longText: '商家已发货，等待交易成功',
    help: '买家如在7天内没有申请退款，交易将自动完成。',
    operations: [{
      type: 'link',
      code: 'modify_express',
      name: '修改物流',
      enable_in_list: false
    }, {
      type: 'link',
      code: 'delay_autofinish',
      name: '延长收货',
      enable_in_list: false
    }]
  },
  'canceled': {
    step: 4,
    text: '交易关闭',
    longText: '交易关闭',
    help: '',
    operations: [{
      type: 'link',
      code: 'remark_order',
      name: '备注',
      enable_in_list: false
    }]
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
