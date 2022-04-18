<template>

  <el-tab-pane label="返回结果">
    <ResponseBodyTip/>
    <AceEditor :source="source"/>
  </el-tab-pane>
</template>

<script>
import ResponseBodyTip from './ResponseBodyTip'
import AceEditor from './../../ace/AceEditor'

export default {
  name: "ResponseBody",
  components: {
    ResponseBodyTip,
    AceEditor,
  },
  data() {
    return {
      source: 'body',
    }
  },
}
</script>

<style scoped>

</style>
