<template>
  <div id="option">
    <div>
      内容类型
      <el-select v-model="contentType" class="m-2" style="width: 85px" @change="changeLanguage">
        <el-option key="JSON" value="JSON"/>
        <el-option key="XML" value="XML"/>
        <el-option key="TEXT" value="Text"/>
      </el-select>
    </div>
    <div class="optionButton" v-on:click="beautifyBody">
      <svg aria-hidden="true" class="icon">
        <use xlink:href="#icon-ziyuan"></use>
      </svg>
      整理格式
    </div>
    <div v-show="showRevertButton" class="optionButton" v-on:click="revertBody">
      <svg aria-hidden="true" class="icon">
        <use xlink:href="#icon-zhongzhi"></use>
      </svg>
      还原格式
    </div>
    <div class="optionButton" v-on:click="copyBody">
      <svg aria-hidden="true" class="icon">
        <use xlink:href="#icon-fuzhi"></use>
      </svg>
      复制
    </div>
    <div class="optionButton" v-on:click="searchBody">
      <svg aria-hidden="true" class="icon">
        <use xlink:href="#icon-sousuo"></use>
      </svg>
      搜索
    </div>
    <div v-show="showReplaceButton" class="optionButton" v-on:click="replaceBody">
      <svg aria-hidden="true" class="icon">
        <use xlink:href="#icon-tihuantupian"></use>
      </svg>
      替换
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import {pd} from "pretty-data";

// ace 文本格式美化
import {beautify} from 'ace-builds/src-noconflict/ext-beautify'

export default {
  name: "AceEditorOption",
  data: function () {
    return {
      contentTypeTemp: "",
    }
  },
  props: {
    aceEditor: Object,
    editorName: String,
    contextText: String,
    showReplaceButton: Boolean,
    showRevertButton: Boolean,
  },
  computed: {
    contentType: function () {
      let request = this.$store.state.ace.requestBodyContentType;
      let response = this.$store.state.ace.responseBodyContentType;
      if (this.editorName === "requestBodyEditor") {
        return request
      }
      if (this.editorName === "responseBodyEditor") {
        return response
      }
      return "JSON"
    },
  },
  methods: {
    changeLanguage: function (value) {
      let language;
      switch (value) {
        case "JSON":
          language = this.$store.state.ace.supportedLanguage.json;
          break
        case "XML":
          language = this.$store.state.ace.supportedLanguage.xml;
          break
        default:
          language = this.$store.state.ace.supportedLanguage.text;
      }
      this.$store.state.ace.requestBodyMode = language;
      this.aceEditor.getSession().setMode(language);

      if (this.editorName === "requestBodyEditor") {
        this.$store.state.ace.requestBodyContentType = value;
      }
      if (this.editorName === "responseBodyEditor") {
        this.$store.state.ace.responseBodyContentType = value;
      }
    },
    revertBody: function () {
      this.aceEditor.setValue(this.contextText, 1)
    },
    beautifyBody: function () {
      let mode = this.aceEditor.getSession().getMode().$id;
      let aceText = this.aceEditor.getSession().getValue();
      switch (mode) {
        case this.$store.state.ace.supportedLanguage.json:
          this.aceEditor.setValue(pd.json(aceText), 1);
          break;
        case this.$store.state.ace.supportedLanguage.xml:
          this.aceEditor.setValue(pd.xml(aceText), 1);
          break
        default:
          beautify(this.aceEditor.session);
      }
    },
    copyBody: function () {
      window.utools.copyText(this.aceEditor.getValue())
      ElMessage({
        message: '复制成功',
        type: 'success',
        duration: 500
      })
    },
    searchBody: function () {
      this.aceEditor.execCommand('find');
    },
    replaceBody: function () {
      this.aceEditor.execCommand('replace');
    },

  }
}
</script>

<style scoped>

.optionButton:hover {
  color: #409EFF;
  cursor: pointer;
}

.optionButton > el-icon {
  vertical-align: middle;
}

#option {
  display: flex;
  height: 40px;
  line-height: 40px;
}

#option > div {
  margin-left: 20px;
}


</style>
