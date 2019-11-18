<template>
  <div>
    <ship-order-form ref="shipOrderModal" @ok="onShipOrder" />
    <remark-order-form ref="remarkOrderModal" @ok="onRemarkOrder" />
    <cancel-order-form ref="cancelOrderModal" @ok="onCancelOrder" />
  </div>
</template>

<script>
import ShipOrderForm from './ShipOrderForm'
import RemarkOrderForm from './RemarkOrderForm'
import CancelOrderForm from './CancelOrderForm'
import { OrderService } from '@/api/service'

export default {
  name: 'OrderOperation',

  components: {
    ShipOrderForm,
    RemarkOrderForm,
    CancelOrderForm
  },

  data () {
    return {
      order: null
    }
  },

  methods: {
    operateOrder (data) {
      const { order, op } = data
      // this.activeOrderBid = operation.bid
      this.order = order
      const opCode = op.code
      console.warn(opCode + ' ' + order.bid)
      if (opCode === 'remark_order') {
        this.$refs.remarkOrderModal.show(order)
      } else if (opCode === 'cancel_order') {
        this.$refs.cancelOrderModal.show(order)
      } else if (opCode === 'ship_invoice') {
        this.$refs.shipOrderModal.show(order)
      }
    },

    async onShipOrder (values) {
      const { bid, useExpress, expressCorp, expressNo } = values
      await OrderService.shipInvoice(bid, useExpress, expressCorp, expressNo)
      setTimeout(() => {
        this.$refs.shipOrderModal.close()
      }, 500)

      this.$emit('change', {
        bid: bid,
        values: {
          status: 'shipped'
        }
      })
    },

    async onRemarkOrder (values) {
      const { bid, remark } = values
      await OrderService.remarkOrder(bid, remark)
      setTimeout(() => {
        this.$refs.remarkOrderModal.close()
      })

      this.$emit('change', {
        bid: bid,
        values: {
          remark: remark
        }
      })
    },

    async onCancelOrder (values) {
      const { bid, reason } = values
      await OrderService.cancelInvoice(bid, reason)
      setTimeout(() => {
        this.$refs.cancelOrderModal.close()
      })

      this.$emit('change', {
        bid: bid,
        values: {
          status: 'canceled'
        }
      })
    }
  }
}
</script>
