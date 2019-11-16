import _ from 'lodash'

class Builder {
  build (properties, reservedSkus) {
    var source = []
    var target = []
    var headers = []
    _.each(properties, function (property) {
      headers.push({
        id: property.id,
        name: property.name
      })

      _.each(property.usedValues, function (propertyValue) {
        if (source.length === 0) {
          target.push([{
            name: propertyValue.name,
            id: propertyValue.id,
            propertyId: property.id,
            propertyName: property.name
          }])
        } else {
          _.each(source, function (sourceItem) {
            sourceItem = _.clone(sourceItem)
            sourceItem.push({
              name: propertyValue.name,
              id: propertyValue.id,
              propertyId: property.id,
              propertyName: property.name
            })
            target.push(sourceItem)
          })
        }
      })

      source = target
      target = []
    })

    var skus = []
    _.each(source, function (values) {
      values = _.sortBy(values, function (value) { return value.propertyId })

      var items = []
      for (var i = 0; i < values.length; ++i) {
        var value = values[i]
        const propertyId = value['propertyId']
        const valueId = value['id']
        items.push(`${propertyId}:${valueId}`)
      }
      // items = _.sortBy(items, function (id) { return id })
      var modelCode = items.join('_')
      skus.push({
        id: -1,
        name: modelCode,
        propertyValues: values,

        price: '',
        stocks: '',
        code: '',
        costPrice: ''
      })
    })

    if (reservedSkus) {
      const name2sku = {}
      reservedSkus.forEach(sku => {
        name2sku[sku.name] = sku
      })

      skus = skus.map(sku => {
        const reservedSku = name2sku[sku.name]
        if (reservedSku) {
          return {
            ...reservedSku,
            propertyValues: sku.propertyValues
          }
        } else {
          return sku
        }
      })
    }

    return {
      headers: headers,
      skus: skus
    }
  }
}

export default new Builder()
