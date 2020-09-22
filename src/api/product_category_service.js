import { Resource } from '@/utils/resource'
import store from '@/store'

class ProductCategoryService {
  async getCategories (fatherId = 0) {
    var resp = await Resource.get({
      resource: 'ginger-product:product.sub_categories',
      data: {
        father_id: fatherId
      }
    })
    
    return {
      datas: resp.data.categories,
      pageinfo: null
    }
  }

  async createCategory (name, fatherId = 0) {
    try {
      await Resource.put({
        resource: 'ginger-product:product.category',
        data: {
          father_id: fatherId,
          name: name
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async getCategoriesTreePath (id) {
    const resp = await Resource.get({
      'resource': 'ginger-product:product.category_tree_path',
      'data': {
        corp_id: store.getters.corp.id,
        end_id: id
      }
    })

    return resp.data.categories
  }

  async updateCategory (id, name) {
    try {
      await Resource.post({
        resource: 'ginger-product:product.category',
        data: {
          id: id,
          name: name
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async disable (id) {
    try {
      await Resource.put({
        resource: 'ginger-product:product.disabled_category',
        data: {
          id: id
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async enable (id) {
    try {
      await Resource.delete({
        resource: 'ginger-product:product.disabled_category',
        data: {
          id: id
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async delete (id) {
    try {
      await Resource.delete({
        resource: 'ginger-product:product.category',
        data: {
          id: id
        }
      })

      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async getCategoryTree () {
    var resp = await Resource.get({
      resource: 'ginger-product:product.category_tree',
      data: {}
    })

    return {
      categories: resp.data.tree.sub_categories
    }
  }
  
  async updateDisplayIndex (categoryId, action) {
    await Resource.post({
      resource: 'ginger-product:product.category_display_index',
      data: {
        id: categoryId,
        action: action
      }
    })
  }
}

export default new ProductCategoryService()
