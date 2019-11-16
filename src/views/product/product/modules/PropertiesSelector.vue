<template>
  <div class="x-propertiesSelector">
    <property-selector
      v-for="usedProperty in usedProperties"
      :selectorId="usedProperty.selectorId"
      :allProperties="getAvailableProperties(usedProperty)"
      :selectedProperty="usedProperty"
      :key="usedProperty.id"
      @change="onChangeProperty"
      @delete="onDeleteProperty"
      @new-property="onCreateProperty"
    >
    </property-selector>
    <h3 class="x-i-groupTitle">
      <a-button @click="onClickAddSku">添加规格项目</a-button>
      <a-button @click="onClickViewData" class="ml10">查看数据</a-button>
    </h3>
  </div>
</template>

<script>
import { CorpService } from '@/api/service'
import PropertySelector from './PropertySelector'

export default {
  components: {
    PropertySelector
  },

  props: {
    skus: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      selector2property: {},

      /**
       * usedProperties的格式:
       *
       * [{
       *   id: -1,
       *   name: '颜色',
       *   usedValues: [{
       *     id: -1,
       *     name: '红色'
       *   }, {
       *     id: -2,
       *     name: '蓝色'
       *   }]
       * }]
       */
      usedProperties: [],

      // allProperties的格式
      // [{
      //   id: -1,
      //   name: '颜色',
      //   values: [{
      //     id: -1,
      //     name: '红色'
      //   }, {
      //     id: -2,
      //     name: '蓝色'
      //   }, {
      //     id: -3,
      //     name: '黄色'
      //   }, {
      //     id: -4,
      //     name: '绿色'
      //   }]
      // }, {
      //   id: -10,
      //   name: '尺寸',
      //   values: [{
      //     id: -5,
      //     name: 'X'
      //   }, {
      //     id: -6,
      //     name: 'M'
      //   }, {
      //     id: -7,
      //     name: 'S'
      //   }]
      // }],
      allProperties: []
    }
  },

  watch: {
    skus: function (skus) {
      console.warn('skus is changed')
      console.log(this.usedProperties)
      // 构造this.usedProperties
      skus.forEach(sku => {
        sku.property_values.forEach(propertyValue => {
          const usedProperty = this.usedProperties.find(usedProperty => {
            if (usedProperty.id === propertyValue.property_id) {
              return true
            }
          })

          if (usedProperty) {
            const existedPropertyValue = usedProperty.usedValues.find(value => { return value.id === propertyValue.id })
            if (!existedPropertyValue) {
              usedProperty.usedValues.push({
                id: propertyValue.id,
                name: propertyValue.text
              })
            }
          } else {
            const selectorId = this.uuidv4()
            this.usedProperties.push({
              id: propertyValue.property_id,
              name: propertyValue.property_name,
              selectorId: selectorId,
              usedValues: [{
                id: propertyValue.id,
                name: propertyValue.text
              }]
            })
          }
        })
      })
      // this.usedProperties = [{
      //   id: -1,
      //   name: '颜色',
      //   usedValues: [{
      //     id: -1,
      //     name: '红色'
      //   }, {
      //     id: -2,
      //     name: '蓝色'
      //   }]
      // }]

      // this.usedProperties.forEach((usedProperty, index) => {
      //   const selectorId = this.uuidv4()
      //   usedProperty.selectorId = selectorId
      //   // this.selector2property[selectorId] = usedProperty
      // })

      this.fireChangeProperties()
    }
  },

  async mounted () {
    const productProperties = await CorpService.getProductProperties()
    // 转换为this.allProperties
    this.allProperties = productProperties.map(property => {
      const values = property.values.map(propertyValue => {
        return {
          id: propertyValue.id,
          name: propertyValue.text
        }
      })

      return {
        id: property.id,
        name: property.name,
        values: values
      }
    })
  },

  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },

    fireChangeProperties () {
      setTimeout(() => {
        this.$emit('change-sku-properties', this.usedProperties)
      })
    },

    getNewPropertyId () {
      return 0 - this.allProperties.length
    },

    getAvailableProperties (usedProperty) {
      const usedPropertyIds = {}
      this.usedProperties.forEach(property => {
        if (property.id !== usedProperty.id) {
          usedPropertyIds[property.id] = true
        }
      })

      return this.allProperties.filter(property => {
        return property.name.length > 0 && !usedPropertyIds.hasOwnProperty(property.id)
      })
    },

    onChangeProperty (selectorId, newProperty) {
      // this.selector2property[selectorId] = newProperty
      this.usedProperties = this.usedProperties.map(usedProperty => {
        if (usedProperty.selectorId === selectorId) {
          newProperty.selectorId = selectorId
          return newProperty
        } else {
          return usedProperty
        }
      })
      this.fireChangeProperties()
    },

    onDeleteProperty (selectorId, property) {
      this.usedProperties = this.usedProperties.filter(usedProperty => {
        return property.id !== usedProperty.id
      })

      this.fireChangeProperties()
    },

    onCreateProperty (selectorId, name) {
      this.allProperties = this.allProperties.map(property => {
        if (property.selectorId === selectorId) {
          return {
            ...property,
            name: name
          }
        } else {
          return property
        }
      })
    },

    onClickAddSku () {
      const newSelectorId = this.uuidv4()
      const newPropertyId = this.getNewPropertyId()
      const newProperty = {
        id: newPropertyId,
        name: '',
        values: [],
        selectorId: newSelectorId
      }
      this.usedProperties.push(newProperty)
      this.allProperties.push(newProperty)
    },

    onClickViewData () {
      console.warn(JSON.stringify(this.usedProperties, ' ', 4))
    }
  }
}
</script>

<style lang="less" scoped>
  .x-propertiesSelector {
    border: 1px solid #e5e5e5;
    background-color: #fff;
    padding: 10px;
    color: #333;

    .x-i-gropuTitle {
      position: relative;
      padding: 7px 10px;
      margin: 0;
      background-color: #f8f8f8;
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
    }
  }
</style>
