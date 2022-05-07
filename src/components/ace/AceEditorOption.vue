<template>
  <div id="option">
    <div>
      内容类型
      <el-select v-model="contentType" class="m-2" style="width: 85px" @change="changeLanguage">
        <el-option key="JSON" value="JSON"/>
        <el-option key="XML" value="XML"/>
        <el-option key="Text" value="Text"/>
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

// import * as ass from "ace-builds/src-noconflict/ace";

export default {
  name: "AceEditorOption",
  data: function () {
    return {
      contentType: "JSON",
    }
  },
  props: {
    aceEditor: Object,
    showReplaceButton: Boolean,
    showRevertButton: Boolean,
    contextText: String,
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
      console.log(language)
      this.aceEditor.getSession().setMode(language);
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
      })
    },
    searchBody: function () {
      this.aceEditor.execCommand('find');
    },
    replaceBody: function () {
      this.aceEditor.execCommand('replace');
      // let dom = ass.define.modules['ace/lib/dom'];
      // console.log(document.body)
      // var fullScreen = dom.toggleCssClass(document.body, "fullScreen")
      // dom.setCssClass(this.aceEditor.container, "fullScreen", fullScreen)
      // this.aceEditor.setAutoScrollEditorIntoView(!fullScreen)
      // this.aceEditor.resize()
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
