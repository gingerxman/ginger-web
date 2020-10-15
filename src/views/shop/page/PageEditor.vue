<template>
  <div class="x-shop-pageEditorPage">
    <top-bar />
    <side-bar @create-component="handleCreateComponent"/>
    <phone 
      :coms="components"
      @select-component="handleSelectComponent"
    />
    <property-editor :component="activeComponent" />
  </div>
</template>

<script>
import { SystemService } from '@/api/service'
import Phone from './modules/Phone'
import TopBar from './modules/TopBar'
import SideBar from './modules/SideBar'
import PropertyEditor from './modules/PropertyEditor'
import { ComponentFactory } from '@/components/PageEditor'
import Vue from 'vue'

export default {
  name: 'PageEditor',

  components: {
    TopBar,
    SideBar,
    Phone,
    PropertyEditor
  },

  computed: {
  },

  created () {
  },

  mounted () {
    const pageId = this.$route.query.id || -1
    // this.loadProduct(productId)
    // this.loadCreateOptions()
  },

  computed: {
    pageComponents () {
      return this.components.filter(component => component)
    }
  },

  data () {
    setTimeout(() => {
      this.handleCreateComponent('core.notice')
      this.handleCreateComponent('core.page')
    }, 500)
    return {
      components: [],
      activeComponent: null
    }
  },

  methods: {
    onSelectCategory (value) {
    },

    handleCreateComponent (type) {
      let component = ComponentFactory.create(type)
      this.components.push(component)
      this.handleSelectComponent(component)
    },

    handleSelectComponent (component) {
      this.activeComponent = component
      this.components = this.components.map(aComponent => {
        if (component.cid === aComponent.cid) {
          aComponent.isActive = true
        } else {
          aComponent.isActive = false
        }

        return aComponent
      })
    },

    async submit (page) {
      alert('submit')
    }
  }
}
</script>

<style lang="less" scoped>
.x-shop-pageEditorPage {
  background-color: #f9f9f9;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}


</style>

<style type="less">
.ant-collapse {
  width: 184px;
  border-radius: 0;
  border: none;
  background-color: #FFF;
}

.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  line-height: 22px;
  padding: 10px 0 10px 15px;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  position: relative;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  font-weight: bold;
  border-bottom: none;
}
.ant-collapse-content > .ant-collapse-content-box {
  padding: 0px;
}

.ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow {
  left: 0px;
  font-weight: bold;
}

.ant-collapse > .ant-collapse-item {
  border-bottom: none;
}

.ant-collapse-content {
  border-top: none;
}
</style>
