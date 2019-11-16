<template>
  <a-modal
    title="取消订单"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="取消原因"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            @change="onChangeReason"
            placeholder="请选择一个取消订单的理由"
          >
            <a-select-option value="无法联系上买家">无法联系上买家</a-select-option>
            <a-select-option value="买家误拍或重拍了">买家误拍或重拍了</a-select-option>
            <a-select-option value="买家无诚意完成交易">买家无诚意完成交易</a-select-option>
            <a-select-option value="已通过银行线下汇款">已通过银行线下汇款</a-select-option>
            <a-select-option value="已通过同城见面交易">已通过同城见面交易</a-select-option>
            <a-select-option value="已通过货到付款交易">已通过货到付款交易</a-select-option>
            <a-select-option value="已缺货无法交易">已缺货无法交易</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
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
      reason: '',
      confirmLoading: false,

      order: null,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (order) {
      this.order = order
      this.visible = true
    },

    close () {
      this.confirmLoading = false
      this.visible = false
      this.order = null
    },

    onChangeReason (reason) {
      this.reason = reason
    },

    handleSubmit () {
      if (this.reason === '') {
        this.$message.error('请选择一个取消订单理由')
        return
      }

      this.confirmLoading = true
      this.$emit('ok', {
        bid: this.order.bid,
        reason: this.reason
      })
    },

    handleCancel () {
      this.close()
    }
  }
}
</script>
