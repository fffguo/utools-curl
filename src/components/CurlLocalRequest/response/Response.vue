<template>
  <el-tabs v-model="this.$store.state.dom.response.activeTabName" class="demo-tabs" type="border-card">
    <el-tab-pane label="返回结果" name="responseResult">
      <ResponseBody/>
    </el-tab-pane>
    <el-tab-pane label="返回头部" name="responseHeader">
      <Header :headers="getResponseHeaders"/>
    </el-tab-pane>
    <el-tab-pane label="请求头部" name="requestHeader">
      <Header :headers="getRequestHeaders"/>
    </el-tab-pane>
    <el-tab-pane label="HTML预览" name="responsePreview">
      <ResponsePreview />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Header from '@/components/CurlLocalRequest/response/Header'
import ResponseBody from '@/components/CurlLocalRequest/response/ResponseBody'
import ResponsePreview from "@/components/CurlLocalRequest/response/ResponsePreview";

export default {

  name: "ResponseComponent",
  components: {
    ResponsePreview,
    Header,
    ResponseBody,
  },
  computed: {
    getRequestHeaders() {
      return this.$store.state.curl.request.headers
    },
    getResponseHeaders() {
      return this.$store.state.curl.response.headers
    },
  },
  methods: {}
}
</script>

<style scoped>

</style>
