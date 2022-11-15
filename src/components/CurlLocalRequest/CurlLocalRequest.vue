<template>
  <div>
    <!--  <el-card>-->
    <Request @parseCurl="parseAndSendCurl"/>
    <el-divider id="divider"/>
    <Response v-show="getResponseShow"/>
    <!--  </el-card>-->
  </div>
</template>
<script>


import Request from "@/components/CurlLocalRequest/request/Request";
import Response from "@/components/CurlLocalRequest/response/Response";
import * as Curl from "parse-curl";
export default {
  name: 'CurlLocalRequest',
  components: {
    Request,
    Response,
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
  computed: {
    getResponseShow() {
      return this.$store.state.dom.response.show
    }
  },

  methods: {
    isURL(s) {
      return /^https?:\/\//.test(s)
    },
    parseAndSendCurl(curlStr) {
      this.$store.state.curl.curlText = curlStr
      let curl = Curl.safeParse(curlStr);
      if (curl === undefined && this.isURL(curlStr)) {
        curl = {method: 'GET', url: curlStr, header: {}, body: ''};
      }
      console.log("curl:", curl)

      //初始化
      this.$store.commit('initByCurlText', curl);

      let curlArgs = {
        url: this.$store.state.curl.request.url,
        method: this.$store.state.curl.request.method,
        headers: this.$store.state.curl.request.headers,
        body: this.$store.state.curl.request.body
      }
      //发送
      if (curl !== undefined) {
        this.$store.commit('sendRequest', curlArgs);
      }
    }
  },
  mounted() {
    window.utools.onPluginEnter(({code, type, payload}) => {
      console.log('用户进入插件', code, type, payload)
      this.parseAndSendCurl(payload)
    });
  },

}


</script>

<style scoped>
.ace_editor.fullScreen {
  height: auto;
  width: auto;
  border: 0;
  margin: 0;
  position: fixed !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.fullScreen {
  overflow: hidden;
  background-color: red;
}

.ace_editor {
  position: relative !important;
  border: 1px solid lightgray;
  margin: auto;
  height: 200px;
  width: 80%;
}

#divider {
  margin: 15px;
  border: 0;
}
</style>
