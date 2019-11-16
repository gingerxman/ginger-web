import { Resource } from '@/utils/resource'

class LoginService {
  constructor () {
    this.name = 'robert'
  }

  async login (corp) {
    console.warn(corp.corp_user.name)
    var resp = await Resource.put({
      resource: 'ginger-account:login.logined_corp_user',
      data: {
        username: corp.corp_user.name,
        password: 'db7c6f3cf1ddda9498dd0148b87038f1'
      }
    })

    return resp.data
  }
}

export default new LoginService()
