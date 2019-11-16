import { Resource } from '@/utils/resource'

class UserService {
  constructor () {
    this.name = 'robert'
  }

  async getUser (userId) {
    var resp = await Resource.get({
      resource: 'ginger-account:user.user',
      data: {
        id: userId
      }
    })

    return resp.data
  }
}

export default new UserService()
