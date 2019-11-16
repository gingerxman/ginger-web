<template>
  <div class="x-skuEditor">
    <table class="x-i-table" :style="{margin:'0',width:'100%',marginBottom:'10px'}">
      <thead>
        <tr>
          <template v-for="header in skuPropertyInfo.headers">
            <th :key="header.id">{{ header.name }}</th>
          </template>
          <th><label class="x-i-required">价格(元)</label></th>
          <th><label class="x-i-required">库存</label></th>
          <th>规格编码</th>
          <th>成本价</th>
          <th>销量</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="sku in skus">
          <tr :key="sku.name" class="x-i-row">
            <td
              style="width:100px"
              v-for="propertyValue in sku.propertyValues"
              :key="propertyValue.id"
            >
              {{ propertyValue.name }}
            </td>
            <td style="width:110px">
              <a-input-number :precision="2" :step="0.01" v-model="sku.price" style="width:80px" />
            </td>
            <td style="width:110px">
              <a-input-number :precision="0" :step="1" v-model="sku.stocks" style="width:80px" />
            </td>
            <td style="width:160px">
              <a-input v-model="sku.code" style="width:130px"/>
            </td>
            <td style="width:200px">
              <a-input-number :precision="2" :step="0.01" v-model="sku.costPrice" style="width:80px" />
            </td>
            <td>
              0
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div style="background-color:#BFBFBF; display:none;">
      {{ JSON.stringify(skus, ' ', 4) }}
    </div>
  </div>
</template>

<script>
import SkuBuilder from './SkuBuilder'

export default {
  props: {
    defaultSkus: {
      type: Array,
      required: true
    },
    /*
     * properties: sku选中的property集合
     * [{
     *    id: 1,
     *    name: '颜色',
     *    usedValues: [{
     *      id: 1,
     *      name: '红色'
     *    }, {
     *      id: 2,
     *      name: '蓝色'
     *    }]
     * }, ...]
     */
    properties: {
      type: Array,
      required: true
    }
  },

  watch: {
    defaultSkus: function (skus) {
      this.skus = this.buildSkus(skus)
    },

    properties: function (properties) {
      const { headers, skus } = SkuBuilder.build(properties, this.skus)
      this.headers = headers
      this.skus = skus
      // this.curSignature = newSignature
    }
  },

  data () {
    this.curSignature = ''
    
    return {
      headers: [],
      skus: this.buildSkus(this.defaultSkus)
    }
  },

  computed: {
    skuPropertyInfo () {
      return SkuBuilder.build(this.properties)
    }
  },

  async mounted () {
  },

  beforeUpdate () {
  },

  updated () {
  },

  methods: {
    getSkus () {
      console.log('in get skus...')
      return this.skus
    },

    buildSkus (skus) {
      if (skus && skus.length > 0) {
        return skus.map(sku => {
          const propertyValues = sku.property_values.map(propertyValue => {
            return {
              id: propertyValue.id,
              name: propertyValue.text,
              propertyId: propertyValue.property_id,
              propertyName: propertyValue.property_name
            }
          })
          return {
            id: sku.id,
            name: sku.name,
            price: sku.price,
            costPrice: sku.cost_price,
            stocks: sku.stocks,
            code: sku.code,
            propertyValues: propertyValues
          }
        })
      } else {
        return []
      }
    },

    // 获得所有sku property集合的签名，签名用于确定sku property集合是否发生变化
    getPropertiesSignature (properties) {
      if (!properties) {
        return ''
      }

      return properties.map(property => {
        return property.usedValues.map(propertyValue => {
          return propertyValue.name
        }).join('.')
      }).join('-')
    },

    getNewPropertyValueId () {
      return -1 - this.property.usedValues.length
    },

    shouldOpenDropdownMenu (usedPropertyValue, index) {
      return (index === this.property.usedValues.length - 1) && (usedPropertyValue.name.length === 0)
    }
  }
}
</script>

<style lang="less" scoped>
  .x-skuEditor {
    position: relative;
    padding: 10px 10px 5px;
    border: 1px solid #e5e5e5;

    label.x-i-required:before {
      display: inline-block;
      margin-right: 4px;
      content: '*';
      font-family: SimSun;
      line-height: 1;
      font-size: 14px;
      color: #f5222d;
  }

    tbody {
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;

      tr {
        border-top: 1px solid #e5e5e5;
        padding: 5px 0px;
      }

      td {
        padding: 5px 1px;
      }

      .x-i-w90 {
        width: 90px;
      }
    }

    a {
      color: #38f;
    }
  }
</style>
