<template>
  <a v-if="value.is_sticked" @click="onClickMove('unstick')">取消置顶</a>
  <a-dropdown v-else>
    <a class="ant-dropdown-link" href="#"> 排序 <a-icon type="down" /> </a>
    <template v-if="sticky">
      <a-menu slot="overlay">
        <a-menu-item v-for="(option, index) in oldOptions" :key="index">
          <a @click="onClickMove(option.value)">{{ option.label }}</a>
        </a-menu-item>
      </a-menu>
    </template>
    <template v-else>
      <a-menu slot="overlay" v-if="reverse">
        <a-menu-item v-for="(option, index) in reverseOptions" :key="index">
          <a @click="onClickMove(option.value)">{{ option.label }}</a>
        </a-menu-item>
      </a-menu>
      <a-menu slot="overlay" v-else>
        <a-menu-item v-for="(option, index) in options" :key="index">
          <a @click="onClickMove(option.value)">{{ option.label }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
export default {
  name: 'SortAction',
  props: {
    value: {
      type: [String, Number, Object],
      default: ''
    },
    reverse: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [{
        label: '上移', value: 'up'
      }, {
        label: '下移', value: 'down'
      }, {
        label: '开始', value: 'top'
      }, {
        label: '末尾', value: 'bottom'
      }, {
        label: '置顶', value: 'stick_top'
      }],
      reverseOptions: [{
        label: '上移', value: 'down'
      }, {
        label: '下移', value: 'up'
      }, {
        label: '开始', value: 'bottom'
      }, {
        label: '末尾', value: 'top'
      }, {
        label: '置顶', value: 'stick_bottom'
      }],
      oldOptions: [{
        label: '置顶', value: 'sticky'
      }, {
        label: '上移', value: 'up'
      }, {
        label: '下移', value: 'down'
      }, {
        label: '置底', value: 'unsticky'
      }]

    }
  },
  methods: {
    onClickMove (action) {
      const value = this.value
      this.$emit('change', { value, action })
    }
  }
}
</script>

<style scoped>

</style>
