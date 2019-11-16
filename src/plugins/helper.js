export default {
  install (Vue, options) {
    Vue.prototype._$dump = function (data) {
      console.log(JSON.stringify(data, ' ', 4))
    }
  }
}
