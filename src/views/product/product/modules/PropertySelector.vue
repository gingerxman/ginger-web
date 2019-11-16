<template>
  <div class="x-propertySelector x-propertyGroup">
    <div class="x-i-removeProperty" @click="onClickRemoveProperty">×</div>
    <h3 class="x-i-title">
      <span class="x-i-label">规格名:</span>
      <div :style="{display:'inline-block'}">
        <a-select
          class="x-a-propertySelect"
          ref="property"
          showSearch
          :value="property.name"
          placeholder="请选择或输入"
          style="width: 120px"
          @change="onSelectProperty"
          @inputKeydown="onInputProperty"
          @blur="onBlurUsedPropertyValue"
          :defaultOpen="shouldFocusProperty()"
          :autoFocus="shouldFocusProperty()"
        >
          <a-select-option
            v-for="p in allProperties"
            :key="p.name"
            :value="p.name"
          >
            {{ p.name }}
          </a-select-option>
        </a-select>
      </div>
    </h3>

    <div class="x-i-container">
      <span class="x-i-label">规格值:</span>
      <div class="x-i-valueList">
        <template v-for="(usedValue, index) in property.usedValues">
          <div
            :key="index"
            class="x-i-value"
          >
            <div class="x-i-remove" @click="onClickRemovePropertyValue(usedValue)">×</div>
            <a-select
              showSearch
              :value="usedValue.name"
              placeholder="请选择或输入"
              style="width: 150px; margin-right: 6px;"
              @change="onSelectPropertyValue"
              @inputKeydown="onInputPropertyValue"
              @focus="onFocusUsedPropertyValue(usedValue)"
              @blur="onBlurUsedPropertyValue"
              :filterOption="filterOption"
              :defaultOpen="shouldOpenDropdownMenu(usedValue, index)"
              :autoFocus="shouldOpenDropdownMenu(usedValue, index)"
            >
              <a-select-option
                :key="vIndex"
                :value="propertyValue.name"
                v-for="(propertyValue, vIndex) in getCandidateValuesForPropertyValue(usedValue)"
              >
                {{ propertyValue.name }}
              </a-select-option>
            </a-select>
          </div>
        </template>
        <div class="x-i-value">
          <a class="ml5" @click="onClickAddPropertyValue">添加规格值</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /*
     * {
     *    id: 1,
     *    name: '颜色',
     *    usedValues: [{
     *      id: 1,
     *      name: '红色'
     *    }, {
     *      id: 2,
     *      name: '蓝色'
     *    }]
     * }
     */
    selectedProperty: {
      type: Object,
      required: true
    },
    allProperties: {
      type: Array,
      required: true
    },
    selectorId: {
      type: String,
      required: true
    }
  },

  data () {
    const property = this.allProperties.find(oneProperty => {
      return oneProperty.name === this.selectedProperty.name
    })
    this.focusPropertyValue = null

    return {
      property: {
        ...this.selectedProperty,
        values: property ? property.values : []
      }
    }
  },

  async mounted () {
    if (this.shouldFocusProperty()) {
      setTimeout(() => {
        this.$refs.property.focus()
        this.$el.querySelector('.x-a-propertySelect input').focus()
      }, 300)
    }
  },

  beforeUpdate () {
  },

  updated () {
  },

  methods: {
    getNewPropertyValueId () {
      return -1 - this.property.usedValues.length
    },

    shouldOpenDropdownMenu (usedPropertyValue, index) {
      return (index === this.property.usedValues.length - 1) && (usedPropertyValue.name.length === 0)
    },

    getCandidateValuesForPropertyValue (curPropertyValue) {
      const usedPropertyValueIds = {}
      this.property.usedValues.forEach(propertyValue => {
        if (propertyValue.id === curPropertyValue.id) {
          // 不过滤当前编辑的property value
          return
        }
        usedPropertyValueIds[propertyValue.id] = true
      })

      return this.property.values.filter(propertyValue => {
        if (usedPropertyValueIds[propertyValue.id]) {
          return false
        } else {
          return true
        }
      })
    },

    shouldFocusProperty () {
      return this.property.id < 0 && this.property.name === ''
    },

    onInputProperty (e) {
      if (e.key === 'Enter') {
        const inputName = e.srcElement.value
        const shouldAdd = this.allProperties.filter(property => property.name === inputName).length === 0
        if (!shouldAdd) {
          return
        }
        e.srcElement.blur()
        this.$refs.property.blur()
        this.$emit('new-property', this.selectorId, inputName)
      }
    },

    onSelectProperty (propertyName) {
      this.property = this.allProperties.find(oneProperty => {
        return oneProperty.name === propertyName
      })
      this.property.usedValues = [{
        id: -1,
        name: ''
      }]
      this.$emit('change', this.selectorId, this.property)
    },

    // 选中property value进行编辑
    onFocusUsedPropertyValue (propertyValue) {
      console.log('focus')
      this.focusPropertyValue = propertyValue
    },

    // 取消对property value进行编辑
    onBlurUsedPropertyValue () {
      // console.log('blur')
      // this.focusPropertyValue = null
    },

    onSelectPropertyValue (selectedPropertyValueName) {
      const selectedPropertyValue = this.property.values.find(propertyValue => {
        return propertyValue.name === selectedPropertyValueName
      })
      const newUsedValues = this.property.usedValues.map(usedValue => {
        if (usedValue.id === this.focusPropertyValue.id) {
          return selectedPropertyValue
        } else {
          return usedValue
        }
      })
      this.property = {
        ...this.property,
        usedValues: newUsedValues
      }

      this.$emit('change', this.selectorId, this.property)
    },

    onInputPropertyValue (e) {
      if (e.key === 'Enter' && this.focusPropertyValue) {
        const inputName = e.srcElement.value
        const shouldAdd = this.property.values.filter(value => value.name === inputName).length === 0
        if (!shouldAdd) {
          return
        }
        console.log(JSON.stringify(this.property.values, ' ', 4))
        const newValues = [{
          id: this.focusPropertyValue.id,
          name: inputName
        }, ...this.property.values]

        this.focusPropertyValue.name = inputName

        this.property = {
          ...this.property,
          values: newValues
        }
        this.$emit('change', this.selectorId, this.property)
      }
    },

    onClickRemovePropertyValue (usedPropertyValue) {
      this.property = {
        ...this.property,
        usedValues: this.property.usedValues.filter(propertyValue => {
          return usedPropertyValue.id !== propertyValue.id
        })
      }
      this.$emit('change', this.selectorId, this.property)
    },

    onClickRemoveProperty () {
      this.$emit('delete', this.selectorId, this.property)
    },

    onClickAddPropertyValue () {
      const newUsedValues = [...this.property.usedValues, {
        id: this.getNewPropertyValueId(),
        name: ''
      }]
      console.log(JSON.stringify(newUsedValues, ' ', 2))
      this.focusPropertyValue = newUsedValues[newUsedValues.length - 1]
      this.property = {
        ...this.property,
        usedValues: newUsedValues
      }
    },

    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang="less" scoped>
  .x-propertySelector {
    position: relative;

    .x-i-removeProperty {
      position: absolute;
      z-index: 2;
      top: -1px;
      right: -1px;
      width: 18px;
      height: 18px;
      font-size: 14px;
      line-height: 16px;
      border-radius: 9px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: hsla(0,0%,60%,.6);
      display: none;
    }
    .x-i-removeProperty:hover {
      background: hsla(0,0%,5%,.6);
    }
    &:hover {
      .x-i-removeProperty {
        display: block;
      }
    }

    a {
      color: #38f;
    }

    .x-i-label {
      display: inline-block;
      width: 50px;
      margin-right: 10px;
    }

    .x-i-title {
      position: relative;
      padding: 7px 10px;
      margin: 0;
      background-color: #f8f8f8;
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
    }

    .x-i-container {
      padding: 7px 10px;
      padding-bottom: 30px;
      display: flex;

      .x-i-valueList {
        flex: 1;
        .x-i-value {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          margin: 5px 0;
          text-align: center;

          .x-i-remove {
            position: absolute;
            z-index: 2;
            top: -1px;
            right: -1px;
            width: 18px;
            height: 18px;
            font-size: 14px;
            line-height: 16px;
            border-radius: 9px;
            color: #fff;
            text-align: center;
            cursor: pointer;
            background: hsla(0,0%,60%,.6);
            display: none;
          }
          .x-i-remove:hover {
            background: hsla(0,0%,5%,.6);
          }
        }
        .x-i-value:hover {
          .x-i-remove {
            display: block;
          }
        }
      }
    }
  }
</style>
