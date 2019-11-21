<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-spin :spinning="spin.spinning" :delay="spin.delayTime" tip="更新商品" size="large">
      <a-form @submit="handleSubmit" :form="form">
        <div class="x-divider">基本信息</div>
        <a-form-item
          label="商品名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入商品名' }]}
            ]"
            name="name"
            ref="nameInput"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="商品卖点"
          help="在商品详情页标题下面展示卖点信息，建议60字以内"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            name="promotionTitle"
            v-decorator="[
              'promotionTitle',
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="商品图"
          help="建议尺寸：800*800像素，最多上传5张"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-upload
            action="/api/ginger-mall/material/image/"
            listType="picture-card"
            name="image"
            :fileList="uploadFileList"
            :showUploadList="{ showPreviewIcon:false, showRemoveIcon:true }"
            @change="onUploadImage"
          >
            <div v-if="images.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="商品类目"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-select
            v-decorator="[
              'category',
            ]"
            showSearch
            placeholder="选择所属行业类目"
            optionFilterProp="children"
            style="width: 200px"
            @change="onSelectCategory"
            :filterOption="filterOption"
          >
            <a-select-option :key="category.id" :value="category.id" v-for="category in categories">{{ category.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <div class="x-divider">价格库存</div>
        <a-form-item
          label="id"
          :style="{display:'none'}"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="[
              'sku.id',
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="name"
          :style="{display:'none'}"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="[
              'sku.name',
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="商品规格"
          help="如有颜色、尺码等多种规格，请添加商品规格"
          :labelCol="labelCol"
          :wrapperCol="{ lg: { span: 15 }, sm: { span: 17 } }">
          <properties-selector
            :skus="skus"
            @change-sku-properties="onChangeSkuProperties"
          ></properties-selector>
        </a-form-item>
        <a-form-item
          v-if="!useStandardSku"
          label="规格明细"
          :labelCol="labelCol"
          :wrapperCol="{ lg: { span: 15 }, sm: { span: 17 } }">
          <sku-editor
            ref="skuEditor"
            :properties="usedProperties"
            :default-skus="skus"
          ></sku-editor>
        </a-form-item>
        <a-form-item
          v-if="useStandardSku"
          label="价格"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :step="0.01"
            :formatter="value => `¥ ${value}`"
            v-decorator="[
              'sku.price',
              {rules: [{ required: true, message: '请输入价格' }]}
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          v-if="useStandardSku"
          label="成本价"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :step="0.01"
            :formatter="value => `¥ ${value}`"
            v-decorator="[
              'sku.costPrice'
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="划线价"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :step="0.1"
            :formatter="value => `¥ ${value}`"
            v-decorator="[
              'linyPrice'
            ]"
            placeholder="" />
        </a-form-item>
        <a-form-item
          v-if="useStandardSku"
          label="库存"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :step="1"
            v-decorator="[
              'sku.stocks',
              {rules: [{ required: true, message: '请输入商品库存' }]}
            ]"
            name="stocks"
            placeholder="" />
        </a-form-item>
        <a-form-item
          label="商品编码"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 4}, sm: {span: 4} }">
          <a-input
            v-decorator="[
              'sku.code',
            ]"
            name="code"
            placeholder="" />
        </a-form-item>

        <div class="x-divider">物流信息</div>
        <a-form-item
          label="快递运费"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-radio-group
            @change="onSelectLogistics"
            :style="{marginTop:'-3px'}"
            v-decorator="[
              'logisticsType',
              {rules: [{ required: true }]}
            ]"
          >
            <a-radio value="unified">
              <span class="mr5">统一运费</span>
              <a-input-number
                :min="0"
                :step="0.01"
                :formatter="value => `¥ ${value}`"
                v-decorator="[
                  'unifiedPostageMoney'
                ]"
                placeholder="" />
            </a-radio>
            <a-radio value="template">运费模板</a-radio>
          </a-radio-group>
        </a-form-item>

        <div class="x-divider">详情</div>
        <a-form-item
          label="商品详情"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-textarea
            rows="4"
            v-decorator="[
              'detail',
            ]"
            placeholder="请输入商品详情"
          />
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
        
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { ProductService } from '@/api/service'
import PropertiesSelector from './modules/PropertiesSelector'
import SkuEditor from './modules/SkuEditor'

export default {
  name: 'ProductForm',

  components: {
    PropertiesSelector,
    SkuEditor
  },

  computed: {
  },

  data () {
    return {
      description: '',
      value: 1,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      
      product: null,
      categories: null,
      images: [{
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      }],
      uploadFileList: [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      }],
      logisticsType: 1,
      skus: [],
      useStandardSku: true,
      usedProperties: [],

      spin: {
        spinning: false,
        delayTime: 100
      },

      // form
      form: this.$form.createForm(this)
    }
  },

  methods: {
    onSelectCategory (value) {
      console.log(`selected ${value}`)
    },

    onSelectLogistics (value) {
      console.log(value)
    },

    onChangeSkuProperties (properties) {
      this.usedProperties = [...properties]
      if (this.usedProperties.length === 0) {
        if (!this.useStandardSku) {
          this.useStandardSku = true
          setTimeout(() => {
            this.form.setFieldsValue({
              sku: {
                id: 0,
                name: 'standard',
                price: 0,
                costPrice: 0,
                stocks: 0,
                code: ''
              }
            })
          }, 100)
        }
      } else {
        if (this.useStandardSku) {
          this.useStandardSku = false
        }
      }
      this.$forceUpdate()
    },

    onUploadImage ({ file, fileList }) {
      this.images = fileList.filter(image => {
        return (image.response && image.response.code === 200) || (image.url)
      }).map(image => {
        if (image.response) {
          return {
            url: image.response.data.path
          }
        } else {
          return {
            url: image.url
          }
        }
      })

      this.uploadFileList = fileList
    },

    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    async handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (err) {
          return
          // eslint-disable-next-line no-console
        }
        this.spin.spinning = true

        let skus = null
        if (this.useStandardSku) {
          skus = [values.sku]
        } else {
          skus = this.$refs.skuEditor.getSkus()
        }
        // TODO: 对sku进行校验

        setTimeout(async () => {
          await this.submitProduct(values, skus)
          this.spin.spinning = false
        }, 300)
      })
    },

    async submitProduct (values, skus) {
      const baseInfo = {
        name: values.name,
        type: 'product',
        category_id: values.category || 0,
        code: '',
        promotion_title: values.promotionTitle,
        detail: values.detail
      }
      // if (values) {
      //   return
      // }
      const mediaInfo = {
        images: this.images,
        thumbnail: this.images[0].url
      }
      
      const skuInfos = skus.map(sku => {
        let properties = []
        if (sku.name !== 'standard') {
          properties = sku.propertyValues.map(propertyValue => {
            return {
              property_id: propertyValue.propertyId,
              property_text: propertyValue.propertyName,
              property_value_id: propertyValue.id,
              property_value_text: propertyValue.name
            }
          })
        }

        return {
          id: sku.id,
          name: sku.name,
          code: sku.code,
          price: parseFloat(sku.price),
          stocks: parseInt(sku.stocks),
          cost_price: parseFloat(sku.costPrice),
          properties: properties
        }
      })

      const imoneyCodes = []
      const logisticsInfo = {
        postage_type: values.logisticsType,
        unified_postage_money: values.unifiedPostageMoney
      }
      console.log('Received values of form: ', values)

      if (this.product != null) {
        const isSuccess = await ProductService.updateProduct(this.product, baseInfo, mediaInfo, skuInfos, imoneyCodes, logisticsInfo)
        if (isSuccess) {
          this.$message.success('更新商品成功');
        } else {
          this.$message.error('更新商品失败！');
        }
      } else {
        await ProductService.createProduct(baseInfo, mediaInfo, skuInfos, imoneyCodes, logisticsInfo)
      }
    },

    loadProduct (productId) {
      if (productId === -1) {
        setTimeout(() => {
          this.form.setFieldsValue({
            name: '东坡肘子',
            category: undefined,
            promotionTitle: '东坡肘子真好吃',
            detail: '东坡肘子的详情',
            linyPrice: 9.99,
            // 物流信息
            logisticsType: 'unified',
            unifiedPostageMoney: 3.14,
            // 规格信息
            sku: {
              id: 0,
              price: 3.14,
              costPrice: 1.11,
              stocks: 10,
              code: '12345'
            }
          })
          this.$refs.nameInput.focus()
        }, 100)
      } else {
        setTimeout(async () => {
          const product = await ProductService.getProduct(productId)
          this.product = product
          this.uploadFileList = product.medias.map(image => {
            return {
              uid: `${image.id}`,
              name: `${image.id}.jpg`,
              status: 'done',
              url: image.url
            }
          })
          this.images = product.medias.map(image => {
            return {
              url: image.url
            }
          })
          
          // get sku
          this.skus = product.skus.map(sku => {
            sku.price = sku.price / 100
            sku.cost_price = sku.cost_price / 100

            return sku
          })

          this.useStandardSku = (this.skus.length === 1 && this.skus[0].name === 'standard')
          let standardSku = null
          if (this.useStandardSku) {
            const firstSku = product.skus[0]
            standardSku = {
              id: firstSku.id,
              name: firstSku.name,
              price: firstSku.price,
              costPrice: firstSku.cost_price,
              stocks: firstSku.stocks,
              code: ''
            }
          } else {
            standardSku = {
              id: 0,
              name: 'standard',
              price: 0,
              costPrice: 0,
              stocks: 0,
              code: ''
            }
          }
          this.form.setFieldsValue({
            name: product.base_info.name,
            category: product.category ? product.category.id : undefined,
            promotionTitle: product.base_info.promotion_title,
            detail: product.base_info.detail,
            logisticsType: product.logistics_info.postage_type,
            unifiedPostageMoney: product.logistics_info.unified_postage_money / 100,
            linyPrice: undefined,
            sku: standardSku
          })
          this.$refs.nameInput.focus()
        }, 100)
      }
    },

    loadCreateOptions () {
      setTimeout(async () => {
        const data = await ProductService.getCreateOptions()
        this.categories = data.categories
      })
    }
  },

  created () {
  },

  mounted () {
    const productId = this.$route.query.id || -1
    this.loadProduct(productId)
    this.loadCreateOptions()
  }
}
</script>

<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 20px
  }

  .x-divider {
    background-color: #f8f8f8;
    font-size: 14px;
    padding: 10px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-radio-wrapper {
    display: block;
    height: 45px;
    line-height: 45px;
  }
</style>
