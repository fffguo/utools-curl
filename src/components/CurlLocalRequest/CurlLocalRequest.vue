<template>
  <div>
    <!--  <el-card>-->
    <Request/>
    <el-divider id="divider"/>
    <Response v-show="getResponseShow"/>
    <!--  </el-card>-->
  </div>
</template>
<script>


import Request from "@/components/CurlLocalRequest/request/Request";
import Response from "@/components/CurlLocalRequest/response/Response";


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

  methods: {},
  mounted() {
    window.utools.onPluginEnter(({code, type, payload}) => {
      console.log('用户进入插件', code, type, payload)
      this.$store.state.curl.curlText = `curl 'http://d2p-api.1000.com.test0.ck/order/list/v2/2?a=1&b' \\
  -H 'Accept: application/json' \\
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \\
  -H 'Connection: keep-alive' \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: _ga=GA1.3.849729764.1643264200; _gid=GA1.3.1328065796.1650332276; gauserid=qm33593oog; SSOTICKET=; SSOEXPIRES=; SSOTHRESHOLD=; qmuid=-1896553836; cxuid=1890023; a9a68f4fefd3b693f10be4a89799dc48=d8e87cedb0ff4c83931c2635807d0b88; _gat=1' \\
  -H 'Origin: http://web.1000.com.test0.ck' \\
  -H 'Platform: pc' \\
  -H 'Platform-No: ' \\
  -H 'Referer: http://web.1000.com.test0.ck/' \\
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.44' \\
  -H 'reqId: f9359ab0-c135-11ec-b566-03eae73dc763' \\
  -H 'systemId: 0033' \\
  --data-raw '{"filter":{"orderStatues":"","payType":"","payStatus":""},"pageNo":0,"pageSize":10,"selfTakeStatus":"","orderPlatformFlag":"0"}' \\
  --compressed \\
  --insecure`

      //初始化
      this.$store.commit('initByCurlText', this.$store.state.curl.curlText)
      //发送
      this.$store.commit('sendRequest')

    });


  }

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
