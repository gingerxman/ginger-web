
class SystemService {
  inDevEnv () {
    return (window.location.href.indexOf("127.0.0.1") !== -1)
  }
}

export default new SystemService()
