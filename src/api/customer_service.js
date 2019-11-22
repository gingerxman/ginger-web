import { Resource } from '@/utils/resource'

class CustomerService {
  constructor () {
    this.name = 'robert'
  }

  async getCustomers () {
    var resp = await Resource.get({
      resource: 'ginger-crm:customer.customers',
      data: {}
    })

    return {
      customers: resp.data.customers,
      pageinfo: resp.data.pageinfo
    }
  }

  async getCustomer () {
    // var resp = await Resource.get({
    //   resource: 'ginger-crm:customer.customers',
    //   data: {}
    // })

    // return {
    //   customers: resp.data.customers,
    //   pageinfo: resp.data.pageinfo
    // }

    return {
      user: {
        name: '周迅'
      }
    }
  }
}

export default new CustomerService()
