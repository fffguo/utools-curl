<template>
  <div class="editor">
    <AceEditorOption :aceEditor="aceEditor"/>
    <div ref="ace" class="ace-editor"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ace from 'ace-builds'
// ace主题
import 'ace-builds/src-noconflict/theme-kuroir'
// ace 文本格式
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-text'
// ace 检索框
import 'ace-builds/src-noconflict/ext-searchbox'
import AceEditorOption from './AceEditorOption'

export default {
  name: "ResponseBody",
  components: {
    AceEditorOption
  },
  props: {
    //body
    source: String
  },
  data: function () {
    return {
      aceEditor: null,
      supportedLanguage: {
        json: "ace/mode/json5",
        xml: "ace/mode/xml",
        text: "ace/mode/text",
      }
    }
  },
  watch: {
    source: function () {
      if (this.props.source === "body") {
        this.$store.state.ace.bodyEdit = this.aceEditor
      }
    }
  },
  mounted() {
    //初始化ace编辑器
    this.aceEditor = window.ace.edit(this.$refs.ace, {
      maxLines: 20, // 最大行数，超过会自动出现滚动条
      minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: 'ace/theme/kuroir', // 默认设置的主题
      mode: this.supportedLanguage.json, // 默认设置的语言模式
      tabSize: 4,// 制表符设置为 4 个空格大小
      readOnly: true //只读
    })
    console.log(this.props)


    window.utools.onPluginEnter(({code, type, payload}) => {
      console.log('用户进入插件', code, type, payload)
      // const copyText = payload.replace(new RegExp('(?<=https?://)[^/]+'), arg.text);
      this.$store.state.curl.curlText = `curl 'http://d2p-api.1000.com.test1.ck/order/list/v2/2' \\
  -H 'Accept: application/json' \\
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \\
  -H 'Connection: keep-alive' \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: _ga=GA1.3.57335965.1642072151; SSOTICKET=; SSOEXPIRES=; SSOTHRESHOLD=; qmuid=646025685; cxuid=1890023; gauserid=qm44273oog; a9a68f4fefd3b693f10be4a89799dc48=ed0fdb95b4044374b8eb0da0732ea835; _gid=GA1.3.1683830964.1649901029; _gat=1; sxuid=-758324235' \\
  -H 'Origin: http://web.1000.com.test1.ck' \\
  -H 'Platform: pc' \\
  -H 'Platform-No: ' \\
  -H 'Referer: http://web.1000.com.test1.ck/' \\
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36 Edg/100.0.1185.39' \\
  -H 'reqId: 52a50370-bb95-11ec-a480-57bc41cb49c7' \\
  -H 'systemId: 0033' \\
  --data-raw '{"pageNo":0,"pageSize":10,"filter":{"orderStatues":"","payType":"","payStatus":""},"selfTakeStatus":"","orderPlatformFlag":"0"}' \\
  --compressed \\
  --insecure`
    })
  }
}
</script>


<style scoped>
.editor {
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}
</style>
