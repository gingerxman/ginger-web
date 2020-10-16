<template>
  <div class="field-text" v-if="component && field">
    <a-form-item
      :label="field.displayName"
      :required="field | isRequiredField" 
      validateStatus=""
      help=""
      :hasFeedback="false"
    >
      <a-input :placeholder="field.placeholder" @change="handleChange" v-model="content" />
    </a-form-item>
  </div>
</template>

<script>
export default {
  name: 'field.Text',

  props: {
    component: {
      type: Object,
      default: null
    },

    field: {
      type: Object,
      default: null
    }
  },

  filters: {
    isRequiredField (field) {
      if (!field.validate) {
        return false
      }

      return field.validate.length > 0
    }
  },

  data () {
    return {
      content: this.component.model[this.field.name]
    }
  },

  methods: {
    handleChange (e) {
      this.$emit('change-field', this.field, this.content)
    }
  }
}
</script>

<style lang="less" scoped>
.field-text {

}
</style>