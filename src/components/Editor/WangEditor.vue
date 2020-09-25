<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
import { SystemService } from '@/api/service'
import DOMPurify from 'dompurify'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null,
      isChange: false
    }
  },
  watch: {
    value (val) {
      this.editorContent = val
      if (!this.isChange) {
        this.editor.txt.html(this.value)
      }
      this.isChange = false
      // 是否禁用编辑功能
      this.editor.$textElem.attr('contenteditable', !this.disabled)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      this.editor = new WEditor(this.$refs.editor)
      this.editor.customConfig.pasteTextHandle = function (content) {
        const node = document.createElement('span')
        node.innerHTML = DOMPurify.sanitize(content, {
          FORBID_ATTR: ['style', 'class', 'font', 'size', 'width', 'height', 'valign', 'border']
        })
        return node.innerHTML
      }
      this.editor.customConfig.customUploadImg = function (files, insert) {
        SystemService.uploadImage(files[0]).then(image => {
          insert(image.path)
        })
      }
      this.editor.customConfig.onchange = (html) => {
        this.isChange = true
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }
      this.editor.create()
    }
  }
}
</script>

<style lang="less">
.w-e-text-container{
  z-index: 10 !important;
}
.w-e-menu{
  z-index: 11 !important;
}
</style>
<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
