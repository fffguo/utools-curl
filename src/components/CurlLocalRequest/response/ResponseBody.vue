<template>
  <div>
    <ResponseBodyTip/>
    <AceEditor :read-only="true" editorName="responseBodyEditor"/>
  </div>
</template>

<script>
import ResponseBodyTip from '@/components/CurlLocalRequest/response/ResponseBodyTip'
import AceEditor from '@/components/ace/AceEditor'


export default {
  name: "ResponseBody",
  components: {
    ResponseBodyTip,
    AceEditor,
  },
  data() {
    return {}
  },
}
</script>

<style scoped>

</style>
