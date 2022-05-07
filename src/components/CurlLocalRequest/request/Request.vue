<template>
  <div id="content">
    <UrlSend id="urlSendStyle"/>
    <el-tabs v-model="getActiveTabName" class="demo-tabs" type="border-card">

      <el-tab-pane label="请求头部" name="requestHeader">
        <TableArgs :tableDataList="getHeadersTableData" class="tableArgsStyle"/>
      </el-tab-pane>
      <el-tab-pane label="请求体" name="requestBody">
        <RequestBody/>
      </el-tab-pane>
      <el-tab-pane label="URL参数" name="requestUrl">
        <TableArgs :tableDataList="getUrlTableData"/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import UrlSend from '@/components/CurlLocalRequest/request/UrlSend'
import TableArgs from '@/components/CurlLocalRequest/request/TableArgs'
import RequestBody from '@/components/CurlLocalRequest/request/RequestBody'

export default {

  name: "RequestComponent",
  components: {
    UrlSend,
    TableArgs,
    RequestBody
  },
  methods: {},
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

    getUrlTableData: function () {
      let url = this.$store.state.curl.request.url;
      let urlArgArr = []
      url.split('?').forEach(item => {
        if (item.indexOf('=') > -1) {
          item.split('&').forEach(i => {
            urlArgArr.push({
              key: i.split('=')[0],
              value: i.split('=')[1]
            })
          })
        }
      })
      return urlArgArr
    },
  }
}
</script>

<style scoped>
#urlSendStyle {
  margin-bottom: 20px;
}

</style>
