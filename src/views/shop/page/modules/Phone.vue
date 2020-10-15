<template>
  <div class="pageEditor-phone preview-wrap">
    <div class="preview">
      <div class="preview-head" @click.stop="handleClickPage">
        <div class="preview-header-title">店铺主页</div>
      </div>

      <div class="preview-body">
        <div
          v-for="component in selectableComponents"
          :key="component.cid"
          :class="['com-item', 'com-item-deletable', component.isActive ? 'com-item-active' : '']"
          @click.stop="handleClickComponent(component)"
        >
          <com-title :component="component" v-if="component.type === 'core.title'" />
          <com-products :component="component" v-if="component.type === 'core.products'" />
          <com-notice :component="component" v-if="component.type === 'core.notice'" />

          <div class="com-widget">
            <i class="com-widget-del"></i>
            <div class="com-widget-name">
              <span class="com-widget-name__arrow-out"></span>
              {{ component.name }}
            </div>
          </div>

          <div class="com-dev" @click.stop="handleClickDev(component)">
            <a-tag color="green">{{ component.cid }}</a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ComponentFactory } from '@/components/PageEditor'
import ComTitle from './components/Title'
import ComProducts from './components/Products'
import ComNotice from './components/Notice'

export default {
  name: 'Phone',

  components: {
    ComTitle,
    ComProducts,
    ComNotice
  },
  
  props: {
    coms: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  computed: {
    selectableComponents () {
      return this.coms.filter(component => component.selectable)
    }
  },

  data () {
    console.log(JSON.stringify(this.coms))
    return {
    }
  },

  methods: {
    handleClickComponent (component) {
      this.$emit('select-component', component)
    },

    handleClickPage () {
      let pageComponent = this.coms.find(component => component.type === 'core.page')
      this.$emit('select-component', pageComponent)
    },

    handleClickDev (component) {
      console.log(JSON.stringify(component))
      console.log(component)
    }
  }
}
</script>

<style lang="less" scoped>
.pageEditor-phone {
  position: absolute;
  top: 56px;
  left: 240px;
  width: 480px;
  // right: 36px;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f8fa;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  div {
    box-sizing: content-box;
  }

  .preview {
    position: absolute;
    top: 72px;
    box-shadow: 0 0 14px 0 rgba(0,0,0,.1);

    .preview-head {
      background-image: url(https://img.yzcdn.cn/public_files/2019/02/11/14417a76b49dac2851efaf744f87cdb4.png);
      height: 64px;
      width: 375px;
      margin: 0 auto;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      position: relative;
    }

    .preview-header-title {
      width: 180px;
      margin: 0 auto;
      height: 34px;
      text-align: center;
      padding-top: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preview-body {
      width: 375px;
      -webkit-transform: scale(1);
      transform: scale(1);
      overflow: visible;
      height: 300px;

      .com-item {
        position: relative;
        width: 100%;
        min-height: 30px;
        cursor: pointer;

        .com-widget {
          position: absolute;
          top: 0;
          right: -40px;
          width: 34px;

          .com-widget-del {
            display: none;
            cursor: pointer;
            position: absolute;
            left: -6px;
            width: 40px;
            height: 28px;
            background-image: url(https://img.yzcdn.cn/public_files/2019/01/25/9b128a3927c6e1484058d2c70cf2e11f.png);
            background-size: 50%;
            background-repeat: no-repeat;
            background-color: #fff;
            background-position: 50%;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
          }
          .com-widget-name {
            display: inline-block;
            background-color: #fff;
            width: 80px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            pointer-events: none;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);

            .com-widget-name__arrow-out {
              width: 0;
              height: 0;
              border: 5px solid transparent;
              border-right-color: #fff;
              position: absolute;
              bottom: 7px;
              left: -10px;
            }
          }
        }

        .com-dev {
          position: absolute;
          top: 0;
          left: -30px;
          width: 34px;
        }
      }
      .com-item:hover:before {
        content: "";
        position: absolute;
        width: 379px;
        height: 100%;
        left: -2px;
        top: 0;
        box-sizing: border-box;
        border: 1px dashed #155bd4;
        z-index: 99;
        cursor: move;
      }
      .com-item-active:before, .com-item-active:hover:before {
        content: "";
        position: absolute;
        width: 379px;
        height: 100%;
        left: -2px;
        top: 0;
        box-sizing: border-box;
        border: 2px solid #155bd4;
        z-index: 99;
        cursor: move;
      }
      .com-item-deletable:hover {
        .com-widget-del {
          display: inline-block;
        }
        .com-widget-name {
          display: none;
        }
      }
    }
  }
}
</style>