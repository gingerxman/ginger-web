import { Resource } from '@/utils/resource'

class ProductService {
  async createProduct (baseInfo, mediaInfo, skuInfos, imoneyCodes, logisticsInfo) {
    var resp = await Resource.put({
      resource: 'ginger-mall:product.product',
      data: {
        base_info: JSON.stringify(baseInfo),
        media_info: JSON.stringify(mediaInfo),
        skus_info: JSON.stringify(skuInfos),
        imoney_codes: JSON.stringify(imoneyCodes),
        logistics_info: JSON.stringify(logisticsInfo)
      }
    })

    return resp.data
  }

  async updateProduct (product, baseInfo, mediaInfo, skuInfos, imoneyCodes, logisticsInfo) {
    skuInfos = skuInfos.map(skuInfo => {
      skuInfo.price = Math.round(skuInfo.price * 100)
      skuInfo.cost_price = Math.round(skuInfo.cost_price * 100)

      return skuInfo
    })

    logisticsInfo.unified_postage_money = Math.round(logisticsInfo.unified_postage_money * 100)
    
    try {
      await Resource.post({
        resource: 'ginger-mall:product.product',
        data: {
          id: product.id,
          base_info: JSON.stringify(baseInfo),
          media_info: JSON.stringify(mediaInfo),
          skus_info: JSON.stringify(skuInfos),
          imoney_codes: JSON.stringify(imoneyCodes),
          logistics_info: JSON.stringify(logisticsInfo)
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async getProducts (type) {
    let resource = ''
    if (type === 'forsale') {
      resource = 'ginger-mall:product.offshelf_products'
    } else if (type === 'onsale') {
      resource = 'ginger-mall:product.onshelf_products'
    }
    const resp = await Resource.get({
      resource: resource,
      data: {
        page: 1,
        count_per_page: 10
      }
    })

    return resp.data
  }

  async getProduct (id) {
    const resp = await Resource.get({
      resource: 'ginger-mall:product.product',
      data: {
        id: id
      }
    })

    return resp.data
  }

  async getCreateOptions () {
    const resp = await Resource.get({
      resource: 'ginger-mall:product.create_options',
      data: {
      }
    })

    return resp.data
  }
}

export default new ProductService()
