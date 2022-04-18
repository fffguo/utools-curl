<template>
  <el-card class="box-card">
    <el-tabs class="demo-tabs">
      <el-tab-pane label="返回结果">
        <ResponseBody/>
      </el-tab-pane>
      <el-tab-pane label="返回头部" name="returnHeader">
        <ResponseHeader/>
      </el-tab-pane>
      <el-tab-pane label="请求头部" name="requestHeader">
        <RequestHeader/>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import RequestHeader from './RequestHeader'
import ResponseHeader from './ResponseHeader'
import ResponseBody from './ResponseBody'

export default {
  name: "ResponseHeader",
  props: {
    response: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    RequestHeader,
    ResponseHeader,
    ResponseBody,
  },
}
</script>

<style scoped>

</style>
