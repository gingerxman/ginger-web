import { axios } from './request'
import qs from 'qs'

// 创建 axios 实例
class ResourceCls {
  async _call (method, endpoint, data, files=null) {
    const timestamp = Math.floor(Date.now())
    const path = endpoint.replace(':', '/').replace('.', '/')
    let url = `/${path}/`

    if (method === 'get') {
      data['_t'] = timestamp
      return axios.get(url, {
        params: data,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'indices' })
        }
      })
    } else {
      if (method === 'put') {
        url += `?_t=${timestamp}&_method=put`
      } else if (method === 'delete') {
        url += `?_t=${timestamp}&_method=delete`
      }

      if (files) {
        return axios.post(url, files, {})
      } else {
        const options = {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(data),
          url: url
        }

        return axios(options)
      }
    }
  }

  async get (option) {
    return this._call('get', option.resource, option.data)
  }

  async put (option) {
    return this._call('put', option.resource, option.data)
  }

  async post (option) {
    return this._call('post', option.resource, option.data)
  }

  async delete (option) {
    return this._call('delete', option.resource, option.data)
  }

  async uploadFile (option) {
    return this._call('put', option.resource, {}, option.files)
  }
}

var instance = new ResourceCls()

export {
  instance as Resource
}
