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
}

export default new AccountService()
