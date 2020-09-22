import { Resource } from '@/utils/resource'

class CorpService {
  async getCorp (corpId) {
    var resp = await Resource.get({
      resource: 'ginger-account:corp.corp',
      data: {
        id: corpId
      }
    })

    return resp.data
  }

  async getProductProperties () {
    var resp = await Resource.get({
      resource: 'ginger-product:product.corp_product_properties',
      data: {
        page: 1,
        count_per_page: 9999
      }
    })

    return resp.data.product_properties
  }
}

export default new CorpService()
