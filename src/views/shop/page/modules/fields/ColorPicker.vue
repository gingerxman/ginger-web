<template>
  <div class="field-colorpicker" v-if="component && field" @click.stop="handleOk">
    <div class="field-control-container">
      <div class="field-control-group__header">
        <div class="field-control-group__label">{{ field.displayName }}</div>
      </div>
      <div class="field-control-group__content">
        <div class="color-picker" @click.stop="handleClickTrigger">
          <a class="reset-btn">
            <span>重置</span>
          </a>
          <div class="trigger-wrapper">
            <div class="trigger">
              <div class="trigger-text">
                <div class="color-preview" :style="{backgroundColor: component.model[field.name]}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sketch-picker v-if="openPicker" :value="component.model[field.name]" @input="handleChange" />
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  name: 'field.ColorPicker',

  components: {
    'sketch-picker': Sketch,
  },

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
      content: this.component.model[this.field.name],
      openPicker: false
    }
  },

  methods: {
    handleChange (e) {
      this.$emit('change-field', this.field, e.hex)
    },

    handleClickTrigger () {
      this.$emit('active')
      setTimeout(() => {
        this.openPicker = true
      })
    },

    handleOk () {

    },

    inactive () {
      this.openPicker = false
      console.log('inactive in ColorPicker')
    }
  }
}
</script>

<style lang="less" scoped>
.field-colorpicker {
  position: relative;
  .vc-sketch {
    position: absolute;
    top: 35px;
    right: 0px;
    z-index: 10;
  }

  .color-picker {
    display: inline-block;
    position: relative;

    .reset-btn {
      margin-right: 10px;
    }

    .trigger-wrapper {
      display: inline-block;

      .trigger {
          cursor: pointer;
          display: inline-block;
          outline: none;
          position: relative;
          text-align: left;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          height: 30px;
          vertical-align: middle;

          .trigger-text {
            background-color: #fff;
            background-color: var(--theme-stroke-9,#fff);
            box-sizing: border-box;
            border: 1px solid #dcdee0;
            border-color: var(--theme-stroke-5,#dcdee0);
            border-radius: 2px;
            display: inline-block;
            width: 50px;
            height: 30px;
            outline: none;
            padding: 5px;
            transition: border-color .25s;
            position: relative;
          }

          .color-preview {
            box-sizing: border-box;
            width: 38px;
            height: 18px;
          }
      }
    }
  }
}
</style>

<style lang="less">
.field-control-container {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -ms-flex-align: center;
    align-items: center;

    .field-control-group__header {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;

      .field-control-group__label {
        margin-right: 16px;
        font-size: 14px;
        color: #969799;
        line-height: 18px;
        white-space: nowrap;
      }
    }

    .field-control-group__content {
      -ms-flex: 1;
      flex: 1;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: end;
      justify-content: flex-end;
      -ms-flex-align: center;
      align-items: center;
    }
}
</style>