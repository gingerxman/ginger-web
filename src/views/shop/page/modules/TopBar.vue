<template>
  <div class="pageEditor-topbar">
    <div><a-button type="default">返回为页面</a-button></div>
    <div>
      <a-button type="default">保存并继续</a-button>
      <a-button type="primary" class="ml10">上架</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',

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
.pageEditor-topbar {
  position: fixed;
  top: 0;
  height: 55px;
  width: 100%;
  border-bottom: 1px solid #ebedf0;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 1px 0 0 rgba(0,0,0,.1);
  padding: 0px 20px;

  justify-content: space-between;
  align-items: center;
}
</style>