<template>
  <a-modal
    title="卖家备注"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            name="remark"
            :autosize="{minRows:2, maxRows:6}"
            v-decorator="[
              'remark',
              {rules: [{required: true, min: 2, message: '请输入至少2个字符的备注信息！'}]}
            ]"
          />
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
      confirmLoading: false,

      order: null,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    show (order) {
      this.order = order
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          remark: order.remark
        })
      }, 100)
    },

    close () {
      this.form.setFieldsValue({
        remark: ''
      })
      this.confirmLoading = false
      this.visible = false
      this.order = null
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.$emit('ok', {
            bid: this.order.bid,
            remark: values.remark
          })
        } else {
          this.confirmLoading = false
        }
      })
    },

    handleCancel () {
      this.close()
    }
  }
}
</script>
