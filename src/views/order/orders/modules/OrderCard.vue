<template>
  <div class="x-order-card list-item">
    <div class="list-item-header">
      <div class="list-item-header-row">
        <div>
          <div class="order-no">订单号：{{ order.bid }}</div>
          <span class="book-time-wrap">下单时间：{{ order.created_at }}</span>
          <div class="circle-dot-wrap">微信-商家微商城</div>
          <div class="zent-popover-wrapper zent-pop-wrapper" style="display: inline-block;"><span style="cursor: pointer;">&nbsp;/&nbsp;微信支付</span></div>
          <span></span>
        </div>
        <div class="operation-btn">
          <a target="_blank" :href="orderUrl">查看详情</a>&nbsp;-&nbsp;
          <div class="remark-content-wrap"><a href="javascript:;" class="remark-content-wrap__link" @click="onClickOperation({code:'remark_order'})">备注</a></div>
        </div>
      </div>
    </div>

    <table class="list-item-body-table">
      <tbody class="list-item-body">
        <tr class="list-item-row">
          <td class="goods-cell">
            <div
              v-for="product in order.products"
              :key="product.id"
              class="goods-item-cell"
            >
              <img class="goods-info__img" :src="product.thumbnail" alt="">
              <div class="goods-info__info">
                <div class="goods-title"><a :href="`/product/product?id=${product.id}`" rel="noopener noreferrer" target="_blank" title="product.name">{{ product.name }}</a></div>
                <div class="goods-skus"><a-tag color="cyan" v-if="formatSkuName(product)">{{ formatSkuName(product) }}</a-tag></div>
                <div class="goods-tags"></div>
              </div>
              <div class="goods-info__price">
                <div>{{ formatPrice(product.price) }}</div>
                <div>{{ product.count }}件</div>
              </div>
            </div>
          </td>
          <td class="aftermarket-cell" rowspan="1">
            <div class="aftermarket"></div>
          </td>
          <td class="customer-cell" rowspan="1">
            <div><a href="/v4/scrm/customer/manage#/detail?yzUid=349847" rel="noopener noreferrer" target="_blank"></a></div>
            <div>
              <p class="user-name">{{ order.ship_info.name }}</p>
              <p>{{ order.ship_info.phone }}</p>
            </div>
          </td>
          <td class="express-cell" rowspan="1">快递</td>
          <td class="pay-price-cell" rowspan="1">
            <div>
              <span>{{ formatPrice(order.final_money) }}</span>
              <div v-if="order.status === 'wait_pay'">
                <a-button type="link" @click="onClickOperation({code:'modify_order_money'})">修改价格</a-button>
              </div>
            </div>
          </td>
          <td rowspan="1" class="state-cell">
            <div class="order-state">
              <div>
                <p>{{ statusInfo.text }}</p>
              </div>
            </div>
          </td>
          <td rowspan="1" class="operation-cell">
            <div class="operation-cell__wrap">
              <div class="option-wrap">
                <div
                  v-for="op in statusInfo.operations"
                  :key="op.code"
                >
                  <a-button v-if="op.enable_in_list" :type="op.type" @click="onClickOperation(op)">{{ op.name }}</a-button>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr class="remark-row buyer-msg" v-if="order.message">
          <td colspan="8">买家备注：{{ order.message }}</td>
        </tr>
        <tr class="remark-row corp-msg" v-if="order.remark">
          <td colspan="8">卖家备注：{{ order.remark }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/util'
import { OrderStatusInfo } from '@/views/order/modules/mixin'

export default {
  props: {
    order: {
      type: Object,
      default: null
    }
  },

  mixins: [OrderStatusInfo],

  computed: {
    orderUrl () {
      return `/order/order?bid=${this.order.bid}`
    }
  },

  data () {
    console.log(this.order)
    return {
    }
  },

  methods: {
    formatPrice (price) {
      return '¥ ' + formatPrice(price)
    },

    formatSkuName (product) {
      if (product.sku_display_name === 'standard') {
        return ''
      } else {
        return product.sku_display_name
      }
    },

    onClickOperation (operation) {
      this.$emit('operation', {
        order: this.order,
        op: operation
      })
    }
  }
}
</script>

<style lang="less">
.x-order-card.list-item {
  margin: 16px 0;
  position: relative;

  .list-item-header {
    background-color: #f7f8fa;
    border: 1px solid #ebedf0;
    border-bottom: 0;
    padding: 16px;
    color: #323233;

    .list-item-header-row {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }

    .order-no {
      display: inline-block;
      margin-right: 10px;
    }

    .book-time-wrap {
      margin-right: 15px;
    }

    .circle-dot-wrap {
      display: inline;
    }

    .operation-btn {
      word-break: keep-all;

      .remark-content-wrap {
        display: inline;
      }
    }
  }

  .list-item-body-table {
    width: 100%;
    border-collapse: collapse;
    color: #323233;

    td {
      border: 1px solid #ebedf0;
      box-sizing: border-box;
      width: 10%;
      padding: 10px 5px;
      text-align: center;
      vertical-align: middle;
    }

    .list-item-body {
      width: 100%;

      .list-item-row {
        width: 100%;
      }

      .goods-cell {
        width: 40%;
        padding: 10px;

        .goods-item-cell {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          -ms-flex-align: center;
          align-items: center;
          padding: 5px 0px;
          border-bottom: solid 1px #ebedf0;

          .goods-info__img {
            width: 60px;
            height: 60px;
            max-width: 60px;
            max-height: 60px;
            min-width: 60px;
            margin-right: 10px;
          }

          .goods-info__info {
            flex-grow: 1;
            text-align: left;

            .goods-title {
              margin-bottom: 10px;
              word-break: break-all;
            }

            .goods-skus {
              margin-bottom: 4px;
            }
          }

          .goods-info__price {
            min-width: 120px;
            text-align: right;
            box-sizing: border-box;
          }
        }

        .goods-item-cell:last-child {
          border: none;
        }
      }

      .price-cell {
        width: 10%;
        text-align: right;
      }

      .aftermarket-cell {
        box-sizing: border-box;
        text-align: center;
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

      .remark-row td {
        word-break: break-word;
        text-align: left;
        padding: 5px 10px;
        background: #fffaeb;
        color: #f90;
      }
      .remark-row.buyer-msg td {
        background: #fdeeee;
        color: #da2626;
      }
      .remark-row.corp-msg td {
        background: #fffaeb;
        color: #f90;
      }
    }
  }
}
</style>
