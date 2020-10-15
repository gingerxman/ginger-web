import _ from 'lodash'
import { Component, Model } from './component'

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ 
      return parent.apply(this, arguments); 
    };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

var COMPONENTS = []; //注册了的组件列表

var CID2COMPONENT = {}; //<cid, component instance>映射

var TYPE2COMPONENT = {}; //<type, Component class>映射

var CID = 1; //全局cid计数器

var ComponentFactory = {
  assignCid: function(component, obj) {
    if (obj && obj.cid) {
      console.debug('[component_factory]: restore component: ', obj.cid);
      component.cid = obj.cid;
      if (CID <= obj.cid) {
        CID = obj.cid + 1;
      }
      component.isNewCreated = false;
    } else {
      component.cid = CID++;
      console.debug('[component_factory]: create new component: ', component.cid);
      component.isNewCreated = true;
    }

    CID2COMPONENT[component.cid] = component;
  },

  /**
	 * 扩展component对象的properties，加入默认项
	 */
	extendProperties: function(component, obj) {
		component.properties = _.cloneDeep(component.properties);
		if (component.properties && component.properties.length > 0) {
			var firstGroup = component.properties[0];
			var fields = firstGroup['fields'];

			fields.splice(0, 0, {
				name: 'index',
				type: 'hidden',
				displayName: '',
				isUserProperty: false,
				default: '-1',
			}, {
				name: 'zindex',
				isUserProperty: false,
				type: 'hidden',
				displayName: '',
				default: 1001,
			}, {
				name: 'auto_select',
				isUserProperty: false,
				type: 'hidden',
				displayName: '',
				default: false,
			});
		}
	},

  /**
   * 创建model
   */
  createModel: function(component, obj) {
    //搜集property
    var defaults = {};
    var propertyGroups = component.properties;
    _.each(propertyGroups, function(group) {
      _.each(group.fields, function(field) {
        component.name2field[field.name] = field;
        var defaultValue = '';
        if (field.hasOwnProperty('default')) {
          defaultValue = field["default"];
        }
        defaults[field.name] = defaultValue;
      })
    });

    //创建新的Model对象
    defaults['index'] = component.cid;
    var model = {...defaults}
    
    //合并obj中输入的model值
    if (obj && obj.model) {
      model = {...model, ...obj.model}

      //清除dynamic fields的内容
      // var dynamicFields = _.filter(component.name2field, function(field, name) {
      //   return field.type === 'dynamic_generated_control';
      // });
      // _.each(dynamicFields, function(dynamicField) {
      //   model.set(dynamicField.name, [], {
      //     silent: true
      //   });
      // }, this);
    }

    return model;
  },

  create: function(type, obj={}) {
    var ComponentClass = TYPE2COMPONENT[type];
    if (!ComponentClass) {
      console.error("class not exists: " + type)
    }

    //创建ComponentClass对象
    var component = new ComponentClass();
    component.type = ComponentClass.type;
    component.name = ComponentClass.componentName;
    component.klass = ComponentClass;
    component.isActive = false

    this.assignCid(component, obj);
    this.extendProperties(component, obj);
    component.model = this.createModel(component, obj);
    // component.data = data

    //初始化property change handler
    // if (!this.propertyChangeHandlers) {
    // 	this.propertyChangeHandlers = {};
    // }

    //初始化dynamicComponentTyeps
    // if (!this.dynamicComponentTypes) {
    // 	this.dynamicComponentTypes = [];
    // }

    // this.createSubComponents(component, obj);
    // this.bindModelChangeHandler(component, obj);

    return component;
  },

  getComponentClassByType (type) {
    return TYPE2COMPONENT[type]
  },

  define: function (protoProps, staticProps) {
    var componentClass = extend.call(Component, protoProps, staticProps);

    var componentType = protoProps.type;
    componentClass.type = componentType;
    componentClass.fullName = componentType;
    componentClass.selectable = protoProps.selectable;
    componentClass.componentName = protoProps.name;

    COMPONENTS.push(componentClass);
    TYPE2COMPONENT[componentType] = componentClass;
    console.debug('[component]: register %s', protoProps.type);
    
    return componentClass;
  },

  getComponents () {
    return COMPONENTS
  }
}

export default ComponentFactory
