import { Resource } from '@/utils/resource'

class PointService {
  async getPointRules () {
    var resp = await Resource.get({
      resource: 'ginger-crm:point.point_rules',
      data: {
      }
    })

    return resp.data
  }

  async getPointRule (ruleId) {
    var resp = await Resource.get({
      resource: 'ginger-crm:point.point_rule',
      data: {
        id: ruleId
      }
    })

    return resp.data
  }

  async createPointRule (type, data, point) {
    var resp = await Resource.put({
      resource: 'ginger-crm:point.point_rule',
      data: {
        type: type,
        data: JSON.stringify(data),
        point: point
      }
    })

    return resp.data
  }

  async updatePointRule (id, type, data, point) {
    var resp = await Resource.post({
      resource: 'ginger-crm:point.point_rule',
      data: {
        id: id,
        type: type,
        data: JSON.stringify(data),
        point: point
      }
    })

    return resp.data
  }

  async deletePointRule (id) {
    await Resource.delete({
      resource: 'ginger-crm:point.point_rule',
      data: {
        id: id
      }
    })
  }
}

export default new PointService()
