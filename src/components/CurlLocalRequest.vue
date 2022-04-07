<template>
  <div>

    <el-input v-model="curlText" :rows="20" type="textarea"/>
    <el-button size="large" type="primary" v-on:click="sendRequest">Send</el-button>

    <!--  </el-card>-->
    <el-divider/>


    <el-card class="box-card">
      <el-tabs class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="返回结果" name="returnResult">

        </el-tab-pane>
        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>
<script>
const CurlConverter = require('curlconverter')
// const url = require("url")
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      curlText: "curl 'http://xcx-caigou.1000.com.test1.ck/api/market/unify/order/query' \\\n" +
          "  -H 'Connection: keep-alive' \\\n" +
          "  -H 'reqId: 1a058460-b25b-11ec-a961-c11fb2209832' \\\n" +
          "  -H 'Accept: application/json' \\\n" +
          "  -H 'Platform-No: ' \\\n" +
          "  -H 'Platform: pc' \\\n" +
          "  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55' \\\n" +
          "  -H 'systemId: 0031' \\\n" +
          "  -H 'Content-Type: application/json' \\\n" +
          "  -H 'Origin: http://web.1000.com.test1.ck' \\\n" +
          "  -H 'Referer: http://web.1000.com.test1.ck/' \\\n" +
          "  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \\\n" +
          "  -H 'Cookie: _ga=GA1.3.57335965.1642072151; _gid=GA1.3.533816500.1648798514; SSOTICKET=; SSOEXPIRES=; SSOTHRESHOLD=; a9a68f4fefd3b693f10be4a89799dc48=6fc756f8a8994635b8b61486de2278bd; qmuid=646025685; cxuid=1890023; sxuid=-758412648; gauserid=qm44273oog' \\\n" +
          "  --data-raw '{\"pageNo\":0,\"pageSize\":10,\"filter\":{\"orderStatus\":\"all\",\"orderStatusList\":[],\"payTypeList\":[],\"payStatusList\":[]},\"selfTakeStatus\":\"\",\"unifyFlag\":\"1\"}' \\\n" +
          "  --compressed \\\n" +
          "  --insecure"

    }
  },
  methods: {
    handleClick: function (tab, event) {
      console.log(tab, event)
    },
    sendRequest: function () {
      console.log(CurlConverter)
      // CurlConverter.toBrowser(this.curlText);
      // const result = eval(jsRequest);
      // console.log(result)
      // console.log(JSON.stringify(result))
    },
  }


}
</script>

<style scoped>
template {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
