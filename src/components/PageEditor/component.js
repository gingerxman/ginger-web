import _ from 'lodash'

var Component = function() {
	this.cid = 0; //component client id
	this.pid = null; //parent component id
	this.pageId = null; //Page Component对应的page id
	this.runtimeData = {}; //运行时数据
	this.isNewCreated = false; //是否是新建的组件对象
	this.name2field = {}; //<field name, field>映射

	this.components = []; //子组件集合
	this.cid2component = {}; //<cid, sub component>映射

	/**
	 * 以下属性来自Component定义，不在此定义
	 * properties
	 * propertyChangeHandlers
	 * dynamicComponentTypes
	 */
}

export default Component
