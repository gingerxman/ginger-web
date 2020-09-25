import { Resource } from '@/utils/resource'

class OrderService {
  async getInvoices (invoiceStatus, pageinfo) {
    console.log('>>>>>>>>>>>>>>>>>>')
    console.log(JSON.stringify(pageinfo))
    const filters = {
      'status': invoiceStatus
    }
    const resource = 'ginger-order:order.corp_invoices'
    const resp = await Resource.get({
      resource: resource,
      data: {
        page: pageinfo.curPage,
        count_per_page: pageinfo.pageSize,
        filters: JSON.stringify(filters)
      }
    })

    let invoices = []
    resp.data.orders.forEach(order => {
      invoices = [...invoices, ...order.invoices]
    })

    pageinfo.update(resp.data.pageinfo)
    console.log(JSON.stringify(pageinfo))

    return {
      'invoices': invoices
    }
  }

  async getOrder (bid) {
    const resp = await Resource.get({
      resource: 'ginger-order:order.order',
      data: {
        bid: bid
      }
    })

    return resp.data
  }

  async remarkOrder (bid, remark) {
    const resp = await Resource.post({
      resource: 'ginger-order:order.order_remark',
      data: {
        bid: bid,
        remark: remark
      }
    })

    return resp.data
  }

  async cancelInvoice (bid, reason) {
    const resp = await Resource.put({
      resource: 'ginger-order:order.canceled_invoice',
      data: {
        bid: bid,
        reason: reason
      }
    })

    return resp.data
  }

  async shipInvoice (bid, useExpress, expressCorp, expressNo) {
    const data = {
      bid: bid,
      enable_logistics: useExpress,
      express_company_name: expressCorp,
      express_number: expressNo,
      shipper: ''
    }
    const resp = await Resource.put({
      resource: 'ginger-order:order.shipped_invoice',
      data: {
        ship_infos: JSON.stringify([data])
      }
    })

    return resp.data
  }
}

export default new OrderService()
