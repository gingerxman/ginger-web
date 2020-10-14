<template>
  <div class="pageEditor-sidebar">
    <div class="side-bar">
      <div class="side-bar-decorate-active side-bar-decorate">
        <div class="side-bar-decorate-text">
          <i class="side-bar-decorate-icon"></i>
          <div>装修</div>
        </div>
      </div>
    </div>

    <div class="coms-lib-wrap">
      <a-collapse :activeKey="['1', '2']">
        <a-collapse-panel key="1" header="基础组件" class="coms-lib coms-lib-active">
          <div class="com-list">
            <div
              v-for="component in components"
              :key="component.type"
              class="com-item"
              @click.stop="handleClickComponent(component)"
            >
              <i class="com-item__icon" :style='{backgroundImage:"url("+component.indicator.img+")"}'></i>
              <div class="com-item__name">商品</div>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="营销组件" class="coms-lib coms-lib-active">
          <div class="com-list">
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import { ComponentFactory } from '@/components/PageEditor'

const COMPONENT_TYPES = [
  'core.title',
  'core.products',
  'core.image_ad'
]

export default {
  name: 'SideBar',

  data () {
    let allComponents = ComponentFactory.getComponents()
    let type2component = {}
    allComponents.forEach(component => {
      type2component[component.type] = component
    })

    return {
      components: COMPONENT_TYPES.map(type => {
        return type2component[type]
      })
    }
  },

  methods: {
    handleClickComponent (component) {
      alert('click ' + component.type)
    }
  }
}
</script>

<style lang="less" scoped>
.pageEditor-sidebar {
  .side-bar {
    width: 75px;
    position: absolute;
    border-right: 1px solid #ebedf0;
    top: 56px;
    left: 0;
    bottom: 0;
    background-color: #fff;

    .side-bar-decorate-text {
      font-size: 12px;
      color: #7d7e80;
      line-height: 16px;
    }

    .side-bar-decorate-icon {
      display: inline-block;
      background-position: 0 0;
      height: 20px;
      width: 20px;
      margin-bottom: 4px;
      background-size: cover;
      background-image: url('https://img.yzcdn.cn/public_files/2019/09/10/d47c5462cfbef5e084682e52e1e4a5eb.png');
    }

    .side-bar-decorate {
      cursor: pointer;
      text-align: center;
      margin: 32px auto 0;
    }

    .side-bar-decorate-active {
      .side-bar-decorate-text {
        color: #155bd4;
        font-weight: 500;
      }
    }
  }

  .coms-lib-wrap {
    position: absolute;
    top: 56px;
    left: 76px;
    overflow-x: hidden;
    overflow-y: auto;
    bottom: 0;
    background: #fff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .coms-lib-active {
      .com-list {
        max-height: 2000px;
        opacity: 1;
      }
    }
    .coms-lib {
      padding: 0 12px;
      .com-list {
        margin: 0 auto;
        padding: 1px;
        width: 160px;
        max-height: 2000px;
        opacity: 1;
        overflow: hidden;
        transition: all .5s cubic-bezier(.23,1,.32,1);
        font-size: 12px;

        .com-item {
          position: relative;
          text-align: center;
          display: inline-block;
          width: 50%;
          height: 70px;
          font-size: 12px;
          margin-bottom: 8px;
          cursor: move;

          &__icon {
            display: inline-block;
            margin-top: 8px;
            background-position: 0 0;
            height: 32px;
            width: 32px;
            background-size: cover;
          }
          &__name {
            color: #323233;
            line-height: 16px;
            margin-top: 4px;
          }
        }
        .com-item:hover {
          background: #155bd4;
          border-radius: 2px;
          font-weight: 700;

          .com-item__icon {
            background-position: 0 32px;
          }
          .com-item__name {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>