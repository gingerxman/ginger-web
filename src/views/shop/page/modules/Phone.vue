<template>
  <div class="pageEditor-phone preview-wrap">
    <div class="preview">
      <div class="preview-head">
        <div class="preview-header-title">店铺主页</div>
      </div>

      <div class="preview-body">
        <div class="com-item com-item-deletable">
          <a href="javascript:void(0)">
            百度1
          </a>
          <div class="com-widget">
            <i class="com-widget-del"></i>
            <div class="com-widget-name">
              <span class="com-widget-name__arrow-out"></span>
              标题文本
            </div>
          </div>
        </div>

        <div class="com-item com-item-deletable">
          <a href="javascript:void(0)">
            百度2
          </a>
          <div class="com-widget">
            <i class="com-widget-del"></i>
            <div class="com-widget-name">
              <span class="com-widget-name__arrow-out"></span>
              标题文本
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ComponentFactory } from '@/components/PageEditor'

export default {
  name: 'Phone',
  data () {
    let title1 = ComponentFactory.create('core.title')
    let title2 = ComponentFactory.create('core.title')
    console.log(title1)
    console.log(title2)
    return {
    }
  },
  methods: {
    handleCancel () {
      // clear form & currentStep
      this.visible = false
      this.currentStep = 0
    }
  }
}
</script>

<style lang="less" scoped>
.pageEditor-phone {
  position: absolute;
  top: 56px;
  left: 262px;
  right: 36px;
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
      .com-item-active:before {
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