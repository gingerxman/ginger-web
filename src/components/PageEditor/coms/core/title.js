"use strict"

import { ComponentFactory } from '@/components/PageEditor'

var Component = ComponentFactory.define({
	type: 'core.title',
	selectable: true,
	propertyViewTitle: '标题',
	name: '标题文本',

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
							displayName: '标题名',
							maxLength: 30,
							validate: 'data-validate="require-notempty::标题名不能为空"',
							validateIgnoreDefaultValue: true,
							isUserProperty: true,
							placeholder:'编辑[标题]',
							default: ''
					},{
							name: 'subtitle',
							type: 'text',
							displayName: '副标题',
							maxLength: 30,
							isUserProperty: true,
							default: ''
					},{
							name: 'time',
							type: 'time',
							isUserProperty: true,
							default: ''
					},{
							name: 'align',
							type: 'radio',
							displayName: '显示',
							isUserProperty: true,
							source: [{name:'居左', value:'left'},{name:'居中', value:'center'},{name:'居右', value:'right'}],
							default: 'left'
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
	indicator: {
			name: '标题',
			img: 'https://img.yzcdn.cn/public_files/2019/02/12/add4829af43def85a200029c3e485d77.png'
	}
});

export default Component
