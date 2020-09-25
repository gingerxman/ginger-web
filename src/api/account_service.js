import { Resource } from '@/utils/resource'

class AccountService {
  constructor () {
    this.name = 'robert'
  }

  async getAllCorps () {
    var resp = await Resource.get({
      resource: 'ginger-account:dev.all_corps',
      data: {}
    })

    return resp.data.corps
  }

  async getCorpUser () {
    var resp = await Resource.get({
      resource: 'ginger-account:corp.corp_user',
      data: {}
    })

    return resp.data
  }
}

export default new AccountService()
