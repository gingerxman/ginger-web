import { Resource } from '@/utils/resource'

class ProductService {
  normalizeMoney (baseInfo, skuInfos, logisticsInfo) {
    skuInfos.forEach(skuInfo => {
      skuInfo.price = Math.round(skuInfo.price * 100)
      skuInfo.cost_price = Math.round(skuInfo.cost_price * 100)
    })

    logisticsInfo.unified_postage_money = Math.round(logisticsInfo.unified_postage_money * 100)
    baseInfo.liny_price = Math.round(baseInfo.liny_price * 100)
  }

  async createProduct (baseInfo, mediaInfo, skuInfos, imoneyCodes, logisticsInfo) {
    this.normalizeMoney(baseInfo, skuInfos, logisticsInfo)
    
    // return
    var resp = await Resource.put({
      resource: 'ginger-product:product.product',
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
    this.normalizeMoney(baseInfo, skuInfos, logisticsInfo)
    
    await Resource.post({
      resource: 'ginger-product:product.product',
      data: {
        id: product.id,
        base_info: JSON.stringify(baseInfo),
        media_info: JSON.stringify(mediaInfo),
        skus_info: JSON.stringify(skuInfos),
        imoney_codes: JSON.stringify(imoneyCodes),
        logistics_info: JSON.stringify(logisticsInfo)
      }
    })
  }

  async getProducts (type, parameter) {
    let resource = ''
    if (type === 'forsale') {
      resource = 'ginger-product:product.offshelf_products'
    } else if (type === 'onsale') {
      resource = 'ginger-product:product.onshelf_products'
    }

    const pagination = parameter.pagination
    const filters = { ...parameter.filters }
    // 去除不需要的filter
    if (filters.hasOwnProperty('category_id') && filters['category_id'] === 0) {
      delete filters.category_id
    }

    const resp = await Resource.get({
      resource: resource,
      data: {
        page: pagination.current,
        count_per_page: pagination.pageSize,
        filters: JSON.stringify(filters)
      }
    })

    return {
      datas: resp.data.products,
      pageinfo: resp.data.pageinfo
    }
  }

  async getProduct (id) {
    const resp = await Resource.get({
      resource: 'ginger-product:product.product',
      data: {
        id: id
      }
    })

    return resp.data
  }

  async getCreateOptions () {
    const resp = await Resource.get({
      resource: 'ginger-product:product.create_options',
      data: {
      }
    })

    return resp.data
  }

  async putProductsOnShelf (products) {
    const productIds = products.map(product => product.id)

    await Resource.put({
      resource: 'ginger-product:product.onshelf_products',
      data: {
        'pool_product_ids': JSON.stringify(productIds)
      }
    })
  }

  async putProductsOffShelf (products) {
    const productIds = products.map(product => product.id)

    await Resource.put({
      resource: 'ginger-product:product.offshelf_products',
      data: {
        'pool_product_ids': JSON.stringify(productIds)
      }
    })
  }

  async getProductCountInfo () {
    const resp = await Resource.get({
      resource: 'ginger-product:product.corp_product_count',
      data: {
      }
    })

    return resp.data
  }
}

export default new ProductService()
