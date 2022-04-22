<template>
  <div id="option">
    <div>
      内容类型
      <el-select v-model="contentType" class="m-2" style="width: 85px">
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
    <div class="optionButton" v-on:click="revertBody">
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

export default {
  name: "AceEditorOption",
  data: function () {
    return {
      contentType: "",
    }
  },
  props: {
    aceEditor: Object,
    showReplaceButton: Boolean,
    contextText: String,
  },
  methods: {
    revertBody: function () {
      this.aceEditor.setValue(this.contextText, 1)
    },
    beautifyBody: function () {
      this.aceEditor.setValue(pd.json(this.contextText), 1)
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
