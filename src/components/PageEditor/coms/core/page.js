"use strict"

import { ComponentFactory } from '@/components/PageEditor'

var Component = ComponentFactory.define({
  type: 'core.page',
  selectable: false,
  propertyViewTitle: '页面设置',
	name: '页面设置',

  properties: [
		{
				group: '',
				groupClass:'xui-propertyView-title',
				groupHelp:{
						className:''
				},
				fields: [{
						name: 'title',
						type: 'text',
						displayName: '页面名称',
						maxLength: 30,
						validate: 'data-validate="require-notempty::标题名不能为空"',
						validateIgnoreDefaultValue: true,
						isUserProperty: true,
						placeholder:'微页面标题',
						default: '微页面标题'
				},{
						name: 'description',
						type: 'text',
						displayName: '页面描述',
						maxLength: 30,
						isUserProperty: true,
						default: ''
				},{
						name: 'background_color',
						type: 'color_picker',
						displayName: '背景颜色',
						isUserProperty: true,
						default: ''
				}]
		}
  ],

  propertyChangeHandlers: {
      title: function($node, model, value) {
          console.log('*****>>>>>');
          console.log($node);
          this.refresh($node);
      },
      subtitle: function($node, model, value){
          this.refresh($node);
      },
      align: function($node, model, value, $propertyViewNode, $propertyFieldNode){
          this.refresh($node, $propertyFieldNode);
      },
      background_color: function($node, model, value, $propertyViewNode){
          $node.css('background-color', value);
      },
      time:function($node, model, value){
          this.refresh($node);
      }
  }
}, {
  indicator: null
});

export default Component
