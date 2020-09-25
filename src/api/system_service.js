import { Resource } from '@/utils/resource'

class SystemService {
  inDevEnv () {
    return (window.location.href.indexOf("127.0.0.1") !== -1)
  }

  async uploadImage (file) {
    var fd = new FormData()
    fd.append('image', file)
    var resp = await Resource.uploadFile({
      resource: 'ginger-gateway:resource.image',
      files: fd
    })
    return resp.data
  }

  async uploadFile (file) {
    var fd = new FormData()
    fd.append('file', file)
    var resp = await Resource.uploadFile({
      resource: 'ginger-gateway:resource.file',
      files: fd
    })
    return resp.data
  }
}

export default new SystemService()
