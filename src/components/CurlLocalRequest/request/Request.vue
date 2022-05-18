<template>
  <div id="content">
    <UrlSend ref="urlSendRef" @refreshArgs="refreshArgs"/>
    <el-tabs v-model="getActiveTabName" class="demo-tabs" type="border-card">

      <el-tab-pane label="请求头部" name="requestHeader">
        <RequestHeaders :tableDataList="getHeadersTableData" class="tableArgsStyle"/>
      </el-tab-pane>
      <el-tab-pane label="请求体" name="requestBody">
        <RequestBody/>
      </el-tab-pane>
      <el-tab-pane label="URL参数" name="requestUrl">
        <UlrArgs ref="urlArgsRef"
                 @addUrlKey="addUrlKey"
                 @changeUrlArg="changeUrlArg"
                 @refreshUrl="refreshUrl"/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import UrlSend from '@/components/CurlLocalRequest/request/UrlSend'
import RequestHeaders from '@/components/CurlLocalRequest/request/RequestHeaders'
import UlrArgs from '@/components/CurlLocalRequest/request/UlrArgs'
import RequestBody from '@/components/CurlLocalRequest/request/RequestBody'

export default {

  name: "RequestComponent",
  components: {
    UrlSend,
    RequestHeaders,
    RequestBody,
    UlrArgs,
  },
  methods: {
    refreshArgs(url) {
      this.$refs.urlArgsRef.refreshArgs(url);
    },
    refreshUrl(selection) {
      this.$refs.urlSendRef.refreshUrl(selection);
    },
    addUrlKey(key) {
      this.$refs.urlSendRef.addUrlArg(key);
    },
    changeUrlArg(oldKey, newKey, oldValue, newValue, index) {
      this.$refs.urlSendRef.changeUrlArg(oldKey, newKey, oldValue, newValue, index);
    },
  },
  computed: {
    getActiveTabName() {
      return this.$store.state.dom.request.activeTabName
    },
    getHeadersTableData: function () {
      let headers = this.$store.state.curl.request.headers;
      let headerArr = [];
      for (const header in headers) {
        headerArr.push({
          key: header,
          value: headers[header]
        })
      }
      return headerArr
    },
  }
}
</script>

<style scoped>

</style>
