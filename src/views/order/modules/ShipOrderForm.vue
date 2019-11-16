<template>
  <a-modal
    title="订单发货"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    class="x-shipOrderForm"
    :okButtonProps="okButtonProps"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        v-if="invoice"
        ref="table"
        size="default"
        class="x-productTable"
        :rowKey="record => record.id"
        :columns="columns"
        :dataSource="invoice.products"
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
      </a-table>

      <a-form style="margin-top:10px;" v-if="invoice">
        <a-form-item
          v-if="invoice.ship_info"
          label="配送信息"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :colon="false"
        >
          <div>配送方式：快递</div>
          <div>收货人：{{ invoice.ship_info.name }} {{ invoice.ship_info.phone }}</div>
          <div>收货地址：{{ invoice.ship_info.area_name }} {{ invoice.ship_info.address }}</div>
        </a-form-item>

        <a-form-item
          label="发货方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :colon="false"
        >
          <a-radio-group @change="onChangeShipType" v-model="shipType">
            <a-radio :value="1">自己联系快递</a-radio>
            <a-radio :value="2">无需物流</a-radio>
          </a-radio-group>
          <div v-if="shipType === 1">
            <a-form-item
              required
              :label-col="{xs: { span: 4 },sm: { span: 4 }}"
              :wrapper-col="{xs: { span: 10 },sm: { span: 10 }}"
              label="物流公司"
              :validate-status="expressCorpValidateStatus"
              :help="expressCorpValidateMsg"
              class="x-expressForm"
            >
              <a-input v-model="expressCorp" style="width:200px" placeholder="请输入物流公司"></a-input>
            </a-form-item>
            <a-form-item
              required
              :label-col="{xs: { span: 4 },sm: { span: 4 }}"
              :wrapper-col="{xs: { span: 10 },sm: { span: 10 }}"
              label="快递单号"
              :validate-status="expressNoValidateStatus"
              :help="expressNoValidateMsg"
              class="x-expressForm"
            >
              <a-input v-model="expressNo" style="width:200px" placeholder="请输入快递单号"></a-input>
            </a-form-item>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const USE_EXPRESS = 1
const NO_EXPRESS = 2

export default {
  computed: {
    expressNoValidateStatus () {
      return ''
    },

    expressNoValidateMsg () {
      return ''
    },

    expressCorpValidateStatus () {
      return ''
    },

    expressCorpValidateMsg () {
      return ''
    },

    okButtonProps () {
      let disabled = false
      if (this.shipType === USE_EXPRESS) {
        disabled = (this.expressCorp.trim() === '') || (this.expressNo.trim() === '')
      }
      return {
        props: {
          disabled: disabled
        }
      }
    }
  },

  data () {
    return {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      visible: false,
      confirmLoading: false,

      columns: [{
        title: '商品',
        scopedSlots: { customRender: 'info' }
      }, {
        title: '数量',
        scopedSlots: { customRender: 'count' },
        width: '120px'
      }],

      invoice: {
      },
      shipType: 1,
      expressNo: '顺丰快递',
      expressCorp: 'E12345'
    }
  },

  methods: {
    show (invoice) {
      this.visible = true
      this.invoice = invoice
    },

    close () {
      this.confirmLoading = false
      this.visible = false
    },

    onChangeShipType (e) {
      if (this.shipType === USE_EXPRESS) {

      } else if (this.shipType === NO_EXPRESS) {
        this.expressCorp = ''
        this.expressNo = ''
      }
    },

    handleSubmit () {
      this.confirmLoading = true
      this.$emit('ok', {
        bid: this.invoice.bid,
        useExpress: this.shipType === USE_EXPRESS,
        expressCorp: this.expressCorp,
        expressNo: this.expressNo
      })
    },

    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.x-productTable .ant-table-thead > tr > th,
.x-productTable .ant-table-tbody > tr > td {
  padding: 10px;
}
.x-expressForm {
  margin-bottom: 10px;
}
.x-expressForm .ant-form-item-control-wrapper {
  margin-left: 0px;
}
</style>

<style lang="less" scoped>
.x-inputRow {
  display: flex;
  flex-direction: row;

  label {
    margin-right: 10px;
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
</style>
