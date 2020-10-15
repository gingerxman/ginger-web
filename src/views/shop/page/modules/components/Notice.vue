<template>
  <div class="com-notice" v-if="component">
    {{ component.model.content }}
  </div>
</template>

<script>
export default {
  name: 'core.Notice',

  props: {
    component: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
    }
  },

  methods: {
    handleOk () {
      
    }
  }
}
</script>

<style lang="less" scoped>
.com-notice {

}
</style>