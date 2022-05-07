<template>
  <div class="editor">
    <AceEditorOption :aceEditor="aceEditor"
                     :context-text="contentText"
                     :show-replace-button="!readOnly"
                     :show-revert-button="readOnly"/>
    <div ref="ace" class="ace-editor">
    </div>
    <!--    <el-backtop :right="50" :bottom="50" />-->

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ace from 'ace-builds'
// ace主题
import 'ace-builds/src-noconflict/theme-kuroir'
// ace 检索框
import 'ace-builds/src-noconflict/ext-searchbox'
// ace 文本格式
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-text'

import AceEditorOption from '@/components/ace/AceEditorOption'

export default {
  name: "ResponseBody",
  components: {
    AceEditorOption
  },
  props: {
    //body
    editorName: String,
    readOnly: Boolean,
  },
  data: function () {
    return {
      aceEditor: null
    }
  },
  mounted() {
    //初始化ace编辑器
    this.aceEditor = window.ace.edit(this.$refs.ace, {
      maxLines: 32, // 最大行数，超过会自动出现滚动条
      minLines: 5, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: 'ace/theme/kuroir', // 默认设置的主题

      mode: this.$store.state.ace.supportedLanguage.json, // 默认设置的语言模式
      tabSize: 4,// 制表符设置为 4 个空格大小
      readOnly: this.readOnly //只读
    })

    if (this.editorName === "requestBodyEditor") {
      this.$store.state.ace.requestBodyEditor = this.aceEditor
    }

    if (this.editorName === "responseBodyEditor") {
      this.$store.state.ace.responseBodyEditor = this.aceEditor
    }
  },
  computed: {
    contentText: function () {
      if (this.editorName === "requestBodyEditor") {
        return this.$store.state.curl.request.body
      }

      if (this.editorName === "responseBodyEditor") {
        return this.$store.state.curl.response.body
      }
      return null
    }
  }
}
</script>


<style scoped>
.editor {
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}
</style>
