<template>
  <div class="pageEditor-propertyEditor">
    <div class="editor-title" v-if="component">
      <div class="editor-title__header">
        <span class="editor-title__name">{{ component.name }}</span>
      </div>
    </div>

    <div
      v-for="(field, index) in userFields"
      :key="`${component.cid}-${field.name}-${index}`"
      class="field-control-group"
    >
      <div style="position:absolute; left:0px; top:-8px;"><a-tag color="green">{{ field.type }}</a-tag></div>
      <field-text v-if="field.type === 'text'" :component="component" :field="field" @change-field="handleChangeField" />
    </div>
  </div>
</template>

<script>
import { ComponentFactory } from '@/components/PageEditor'
import FieldText from './fields/Text'

export default {
  name: 'PropertyEditor',

  components: {
    FieldText
  },

  props: {
    component: {
      type: Object,
      default: null
    }
  },

  computed: {
    userFields () {
      if (!this.component) {
        return []
      }
      return this.component.properties[0].fields.filter(field => field.isUserProperty)
    }
  },

  data () {
    return {
      
    }
  },

  methods: {
    handleChangeField (field, value) {
      this.component.model[field.name] = value
      console.log(JSON.stringify(this.component.model))
    }
  }
}
</script>

<style lang="less" scoped>
.pageEditor-propertyEditor {
  width: 376px;
  position: absolute;
  padding-bottom: 100px;
  top: 56px;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  bottom: 0;
  background: #fff;

  .editor-title {
    padding: 24px 16px;
    border-bottom: 1px solid #f2f4f6;

    &__header {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
    }

    &__name {
      margin-right: auto;
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      color: #323233;
      text-align: left;
    }
  }

  .field-control-group {
    padding: 12px 16px;
    position: relative;
  }
}
</style>