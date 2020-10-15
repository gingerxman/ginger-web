"use strict"

import { ComponentFactory } from '@/components/PageEditor'

var Component = ComponentFactory.define({
	type: 'core.notice',
	selectable: true,
	propertyViewTitle: '公告',
	name: '公告',

	properties: [
			{
					group: '',
					groupClass:'propertyEditor-notice',
					groupHelp:{
							className:''
					},
					fields: [{
							name: 'content',
							type: 'text',
							displayName: '公告',
							maxLength: 30,
							validate: 'data-validate="require-notempty::标题名不能为空"',
							validateIgnoreDefaultValue: true,
							isUserProperty: true,
							placeholder:'请填写内容，如果过长，将会在手机上滚动显示',
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
	indicator: {
			name: '公告',
			img: 'https://img.yzcdn.cn/public_files/2019/02/12/c52262f634e5fbba92f69abb8d7134ee.png'
	}
});

export default Component
