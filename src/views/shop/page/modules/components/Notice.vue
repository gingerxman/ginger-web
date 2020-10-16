<template>
  <div class="com-notice" v-if="component" :style="{backgroundColor:component.model.background_color}">
    <div class="i-content" :style="{color:component.model.color}">
    {{ component.model.content }}
    </div>
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
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  color: #ed6a0c;
  font-size: 14px;
  line-height: 24px;
  background-color: #fffbe8;

  padding-left: 35px;

  .i-content {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    height: 24px;
    overflow: hidden;
  }
}
.com-notice:before {
  content: "";
  position: absolute;
  left: 10px;
  top: 13px;
  width: 16px;
  height: 16px;
  background-image: url(https://img.yzcdn.cn/public_files/2017/8/10/6af5b7168eed548100d9041f07b7c616.png);
  background-size: 16px 16px;
}
</style>