<template>
  <a-modal
    title="编辑商户分类"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="分类名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            name="name"
            ref="nameInput"
            placeholder="输入分类名称"
            v-decorator="[
              'name',
              {rules: [{required: true, min: 1, message: '请输入至少1个字符的分类名！'}]}
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

      category: null,
      form: this.$form.createForm(this)
    }
  },

  methods: {
    show (category) {
      this.category = category
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          name: category.name
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
      this.order = null
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.$emit('ok', {
            id: this.category ? this.category.id : 0,
            name: values.name
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
