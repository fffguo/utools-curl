<template>
  <div>
    <el-input v-model="this.$store.state.curl.curlText" :rows="5" type="textarea"/>
    <el-button size="large" type="primary" v-on:click="sendRequest">发送</el-button>
    <el-button size="large" type="primary" v-on:click="refresh">刷新</el-button>
    <!--  </el-card>-->
    <!--    <el-divider/>-->
    <Response v-show="response.show"/>
  </div>

</template>
<script>

import Response from "@/components/CurlLocalRequest/response/Response";
import {pd} from "pretty-data";

const CURLParser = require('parse-curl')

export default {
  name: 'HelloWorld',
  components: {
    Response
  },
  props: {
    msg: String
  },
  data() {
    return {
      //返回结果
      response: {
        show: false
      },
    }
  },
  methods: {
    refresh: function () {
      window.location.reload()
    },
    //发送请求
    sendRequest: function () {
      let _this = this

      let curl = CURLParser(_this.$store.state.curl.curlText);
      console.log(curl)
      //构造参数
      let args = {
        "url": curl.url,
        "method": curl.method,
        "headers": curl.header,
        "body": curl.body
      }
      _this.$store.state.curl.request.headers = curl.header
      //发送
      window.sendRequest(args, function (response) {

        //response header
        _this.$store.state.curl.response.headers = response.headers
        //请求结束
        let body = ""
        response.on('end', () => {
          _this.$store.state.curl.response.body = body
          _this.$store.state.ace.bodyEdit.setValue(pd.json(body), 1)
          _this.$store.state.ace.bodyEdit.getSession().setMode("ace/mode/json5")
        })
        //返回体,body过大会多次回调
        response.on('data', (data) => {
          body += data.toString();
        })
        //失败
        response.on('error', error => {
          _this.$store.state.curl.response.body = error.toString()
          _this.$store.state.ace.bodyEdit.setValue(error.toString(), 1)
          _this.$store.state.ace.bodyEdit.getSession().setMode("ace/mode/text")
        })

      })
    },

  },

}


</script>

<style scoped>
template {
  margin-left: 10px;
  margin-right: 10px;
}


</style>
