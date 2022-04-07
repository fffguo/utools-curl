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
// const curlrequest = require('curlrequest')
// const CurlConverter = require("curlconverter")
import CurlConverter from 'curlconverter'
// var child = require('child_process');

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      curlText: "curl 'http://bugatti.dev.qianmi.com/ci/releases?projectId=691&page=0&pageSize=10&version=&user=&tag=' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: unwatchproductnames=%5B%22default%22%2C%22%u6591%u9A6C_%u529B%u65B9%22%2C%22%u9500%u6BC1%22%5D; experimentation_subject_id=ImFjMmMzNzE2LTYyNzMtNGRjNy04MTY2LTcwZGYxMDZkYmRjOSI%3D--2ae3c9b1afe6cf752b428c2cc7f0efeac3ed349c; SESSION=0b75cc03-d4be-4576-bd77-dd03fb46a0e4; balanceTable=%7B%22datacenter%22%3A%7B%22id%22%3A1%2C%22text%22%3A%22%u6570%u636E%u4E2D%u5FC3%22%2C%22tip%22%3A%22%u6570%u636E%u4E2D%u5FC3%22%2C%22checked%22%3Atrue%2C%22width%22%3A%2210%25%22%2C%22name%22%3A%22datacenter%22%2C%22open%22%3Afalse%7D%2C%22balance%22%3A%7B%22id%22%3A2%2C%22text%22%3A%22%u8D1F%u8F7D%22%2C%22tip%22%3A%22%u8D1F%u8F7D%22%2C%22checked%22%3Atrue%2C%22width%22%3A%2210%25%22%2C%22name%22%3A%22balance%22%2C%22open%22%3Afalse%7D%2C%22version%22%3A%7B%22id%22%3A3%2C%22text%22%3A%22%u7248%u672C%22%2C%22tip%22%3A%22%u7248%u672C%22%2C%22checked%22%3Atrue%2C%22width%22%3A%2210%25%22%2C%22name%22%3A%22version%22%2C%22open%22%3Afalse%7D%2C%22group%22%3A%7B%22id%22%3A4%2C%22text%22%3A%22%u7EC4%22%2C%22tip%22%3A%22%u7EC4%22%2C%22checked%22%3Atrue%2C%22width%22%3A%225%25%22%2C%22name%22%3A%22group%22%2C%22open%22%3Afalse%7D%2C%22tag%22%3A%7B%22id%22%3A5%2C%22text%22%3A%22%u6807%u7B7E%22%2C%22tip%22%3A%22%u6807%u7B7E%22%2C%22checked%22%3Atrue%2C%22width%22%3A%225%25%22%2C%22name%22%3A%22tag%22%2C%22open%22%3Afalse%7D%2C%22queue%22%3A%7B%22id%22%3A6%2C%22text%22%3A%22QUEUE%22%2C%22tip%22%3A%22%u961F%u5217%22%2C%22checked%22%3Atrue%2C%22width%22%3A%225%25%22%2C%22name%22%3A%22queue%22%2C%22open%22%3Afalse%7D%2C%22status%22%3A%7B%22id%22%3A7%2C%22text%22%3A%22%u64CD%u4F5C%u72B6%u6001%22%2C%22tip%22%3A%22%u64CD%u4F5C%u72B6%u6001%22%2C%22checked%22%3Atrue%2C%22width%22%3A%2220%25%22%2C%22name%22%3A%22status%22%2C%22open%22%3Afalse%7D%2C%22warn%22%3A%7B%22id%22%3A8%2C%22text%22%3A%22%u544A%u8B66%u72B6%u6001%22%2C%22tip%22%3A%22%u544A%u8B66%u72B6%u6001%22%2C%22checked%22%3Atrue%2C%22width%22%3A%227%25%22%2C%22name%22%3A%22warn%22%2C%22open%22%3Afalse%2C%22selected%22%3A%22false%22%7D%2C%22startstop%22%3A%7B%22id%22%3A9%2C%22text%22%3A%22%u542F%u505C%u72B6%u6001%22%2C%22tip%22%3A%22%u542F%u505C%u72B6%u6001%22%2C%22checked%22%3Atrue%2C%22width%22%3A%227%25%22%2C%22name%22%3A%22startstop%22%2C%22open%22%3Afalse%7D%2C%22stop%22%3A%7B%22id%22%3A10%2C%22text%22%3A%22%22%2C%22tip%22%3A%22%u7EC8%u6B62%u4EFB%u52A1%22%2C%22checked%22%3Atrue%2C%22width%22%3A%223%25%22%2C%22name%22%3A%22stop%22%2C%22open%22%3Afalse%7D%2C%22quickoperate%22%3A%7B%22id%22%3A11%2C%22text%22%3A%22%u4F20%u9001%u95E8%22%2C%22tip%22%3A%22%u4F20%u9001%u95E8%22%2C%22checked%22%3Atrue%2C%22width%22%3A%226%25%22%2C%22name%22%3A%22quickoperate%22%2C%22open%22%3Afalse%7D%2C%22operate%22%3A%7B%22id%22%3A12%2C%22text%22%3A%22%u64CD%u4F5C%22%2C%22tip%22%3A%22%u64CD%u4F5C%22%2C%22checked%22%3Atrue%2C%22width%22%3A%2212%25%22%2C%22name%22%3A%22operate%22%2C%22open%22%3Afalse%7D%7D; envid=14' \
  -H 'Referer: http://bugatti.dev.qianmi.com/' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29' \
  --compressed \
  --insecure"

    }
  },
  methods: {
    handleClick: function (tab, event) {
      console.log(tab, event)
    },
    sendRequest: function () {

      console.log("VUE_APP_TITLE:" + process.env.VUE_APP_TITLE)
      console.log("process.env.YARGS_MIN_NODE_VERSION:" + process.env.YARGS_MIN_NODE_VERSION)
      // curlrequest.request(this.curlText,  function (err, stdout, meta) {
      //   console.log('%s %s', meta.cmd, meta.args.join(' '));
      // });
      // console.log(CurlConverter)
      CurlConverter.toBrowser(this.curlText);
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
