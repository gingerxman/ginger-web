<template>
  <a-modal
    title="编辑积分规则"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="奖励分值"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0"
            :step="1"
            v-decorator="[
              'point',
              {rules: [{required: true, message: '请输入奖励分值！'}]}
            ]"
          />
        </a-form-item>

        <a-form-item
          label="奖励"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            name="name"
            ref="nameInput"
            placeholder="输入客户名"
            v-decorator="[
              'name',
              {rules: [{required: true, min: 1, message: '请输入至少1个字符的分类名！'}]}
            ]"
          />
        </a-form-item>

        <a-form-item
          label="性别"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="[
              'type',
            ]"
            button-style="solid"
          >
            <a-radio-button value="weixin" :disabled="true">
              关注微信公众号
            </a-radio-button>
            <a-radio-button value="trade">
              每成功交易
            </a-radio-button>
            <a-radio-button value="money">
              每购买金额
            </a-radio-button>
          </a-radio-group>
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

      rule: null,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    show (rule) {
      this.rule = rule
      this.visible = true
      setTimeout(async () => {
        this.form.setFieldsValue({
          point: rule ? rule.point : '',
          type: rule ? rule.type : '',
        })
      }, 100)
      setTimeout(() => {
        this.$refs.nameInput.focus()
      }, 500)
    },

    close () {
      this.form.setFieldsValue({
        name: ''
      })
      this.confirmLoading = false
      this.visible = false
      this.rule = null
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.$emit('ok', {
            id: this.rule ? this.rule.id : 0,
            name: values.name,
            sex: values.sex,
            height: 0, // values.height,
            weight: 0, // values.weight,
            phone: values.phone,
            address: values.address
          })
        } else {
          this.confirmLoading = false
        }
      })
    },

    handleCancel () {
      this.close()
    },

    onChangeRole (checkedList) {
    }
  }
}
</script>
