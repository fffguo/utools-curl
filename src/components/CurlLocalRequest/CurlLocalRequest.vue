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
import CURLParser from "parse-curl";

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
      console.log('用户进入插件', code, type)
      //     payload=`curl 'http://item-admin-api.1000.com.test6.ck/api/spu/query' \\
      // -H 'Accept: application/json' \\
      // -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \\
      // -H 'Connection: keep-alive' \\
      // -H 'Content-Type: application/json' \\
      // -H 'Cookie: _ga=GA1.3.1304103374.1651715581; _gid=GA1.3.721802883.1652662788; SSOTICKET=; SSOEXPIRES=; SSOTHRESHOLD=; sxuid=-755786324; a9a68f4fefd3b693f10be4a89799dc48=77e71e0956fe48abb6d14d0b492a859c; qmuid=-1030958195; cxuid=1391111; gauserid=qm13780sgr; _gat=1' \\
      // -H 'Origin: http://web.1000.com.test6.ck' \\
      // -H 'Platform: pc' \\
      // -H 'Platform-No: ' \\
      // -H 'Referer: http://web.1000.com.test6.ck/' \\
      // -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47' \\
      // -H 'reqId: e2692470-d736-11ec-b8f8-f32dbe9955c5' \\
      // -H 'systemId: 0031' \\
      // --data-raw '{"channel":"d2p","searchTypeList":["1"],"brandId":"","queryForbidSale":"","recentPriceUpdateTime":"","keywords":"","pageNo":0,"pageSize":10,"sortEntries":[],"spuBusinessId":"","tagId":"","parentItem":"","cats":""}' \\
      // --compressed \\
      // --insecure`
      this.$store.state.curl.curlText = payload

      let curl = CURLParser(payload);

      //初始化
      this.$store.commit('initByCurlText', curl);

      let curlArgs = {
        url: this.$store.state.curl.request.url,
        method: this.$store.state.curl.request.method,
        headers: this.$store.state.curl.request.headers,
        body: this.$store.state.curl.request.body
      }
      //发送
      this.$store.commit('sendRequest', curlArgs)
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
