<template>

  <div id="urlSend">
    <el-row class="elRow">
      <!--      <el-col :span="3" class="elCol">-->
      <!--        <div class="grid-content bg-purple-dark cursorPointer" v-on:click="clearCurl">-->
      <!--          <el-tag class="ml-2">清空</el-tag>-->
      <!--        </div>-->
      <!--      </el-col>-->
      <el-col :span="3" class="elCol">
        <div class="grid-content bg-purple-dark cursorPointer" v-on:click="getCurlAndCopy">
          <el-tag class="ml-2">提取剪切板中的curl</el-tag>
        </div>
      </el-col>
      <el-col :span="3" class="elCol">
        <div class="grid-content bg-purple-dark cursorPointer" v-on:click="makeCurlAndCopy">
          <el-tag class="ml-2">复制curl</el-tag>
        </div>
      </el-col>
      <el-col :span="7" class="elCol">
        <div style="width: 200px">
          <el-input v-model="replaceDomain"
                    class="input-with-select"
                    placeholder="127.0.0.1:8080"
                    size="small"
                    @blur="domainReplaceChangeBlur"
                    @focus="domainReplaceChangeFocus">
            <template #prepend>
              <el-button id="domainRevertButton" size="small" type="primary" v-on:click="clickRevertDomain">还原
              </el-button>
            </template>
            <template #append>
              <el-button id="domainReplaceButton" size="small" type="primary" v-on:click="clickReplaceDomain">替换
              </el-button>
            </template>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-input v-model="this.$store.state.curl.request.url"
              v-on:focus="this.oldUrl = this.$store.state.curl.request.url"
              class="input-with-select"
              placeholder="请输入测试地址~"
              @input="urlChange"
              size="large">
      <template #prepend>
        <el-select v-model="this.$store.state.curl.request.method" class="requestTypeStyle" size="large">
          <el-option label="GET" value="GET"/>
          <el-option label="POST" value="POST"/>
          <el-option label="PUT" value="PUT"/>
          <el-option label="DELETE" value="DELETE"/>
          <el-option label="HEAD" value="HEAD"/>
          <el-option label="OPTIONS" value="OPTIONS"/>
          <el-option label="PATCH" value="PATCH"/>
        </el-select>
      </template>
      <template #append>
        <el-button v-show="!loading" id="sendButton" size="large" type="primary" v-on:click="sendRequest">发送
        </el-button>
        <el-button v-show="loading" id="cancelButton" class="cursorPointer" size="large" type="primary"
                   v-on:click="cancelRequest">取消
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script>
import curlString from "curl-string";
import {ElMessage} from "element-plus";

export default {
  name: "UrlComponent",
  computed: {
    loading: function () {
      return this.$store.state.dom.loading;
    },
    startInit: function () {
      return this.$store.state.dom.request.startInit;
    },
  },
  data: function () {
    return {
      oldUrl: "",
      replaceDomain: ""
    }
  },
  watch: {
    //初始化
    startInit: function () {
      if (this.$store.state.dom.request.startInit) {
        this.url = this.$store.state.curl.request.url;
      }
    },
    '$store.state.curl.request.initUrl'(value) {
      if (value) {
        this.refreshDomain(value)
      }
    }
  },
  methods: {
    //发送请求
    sendRequest: function () {
      //构造请求
      let curlArgs = {
        url: this.$store.state.curl.request.url,
        method: this.$store.state.curl.request.method,
        headers: this.$store.getters.getRealTimeHeaders,
        body: this.$store.getters.getRealTimeBody
      }
      //发送请求
      this.$store.commit('sendRequest', curlArgs)
    },
    //生成curl并赋值
    clearCurl: function () {
      this.$store.state.curl.request.url = ""
      this.$store.state.curl.request.method = ""
      this.$store.state.curl.request.headers = ""
      this.$store.state.curl.request.body = ""
    },
    //提取剪切板中的curl
    getCurlAndCopy: function () {
      navigator.clipboard.readText().then((text) => {
        if (/^(https?:\/\/|curl)/.test(text)) {
          console.log('剪切板内容正常');
          this.$emit("parseCurl", text)
        } else {
          ElMessage({
            message: '不支持的剪切板内容',
            type: 'error',
            duration: 500
          })
        }
      }).catch(() => {
        ElMessage({
          message: '读取剪切板失败',
          type: 'error',
          duration: 500
        })
      });
    },
    //生成curl并赋值
    makeCurlAndCopy: function () {
      const url = this.$store.state.curl.request.url;
      const options = {
        method: this.$store.state.curl.request.method,
        headers: this.$store.getters.getRealTimeHeaders,
        body: this.$store.getters.getRealTimeBody
      };
      const curlStringOptions = {colorJson: false, jsonIndentWidth: 2}
      window.utools.copyText(curlString(url, options, curlStringOptions).trim())
      ElMessage({
        message: '复制成功',
        type: 'success',
        duration: 500
      })
    },
    //替换域名端口
    clickReplaceDomain: function () {
      let url = this.$store.state.curl.request.url;
      console.log(url)

      let urlObject = window.newURL(url);
      console.log(urlObject)
      let domain = this.replaceDomain === "" ? "127.0.0.1:8080" : this.replaceDomain
      try {
        window.newURL("https://" + domain);
      } catch (e) {
        ElMessage({
          message: '域名不合法' + e,
          type: 'error',
          duration: 500
        })
        return
      }

      this.$store.state.curl.request.url = url
          .replace("https://", "http://")
          .replace(urlObject.hostname + (urlObject.port === "" ? "" : ":" + urlObject.port), domain)

      // 存储映射关系
      const initUrlObject = window.newURL(this.$store.state.curl.request.initUrl)
      const saveMappingUrl = initUrlObject.hostname + (initUrlObject.port === "" ? "" : ":" + initUrlObject.port);
      const dbUrlMapping = window.utools.db.get("urlMapping");
      const urlMapping = dbUrlMapping?.data ?? {}
      urlMapping[saveMappingUrl] = domain;
      window.utools.db.put({
        _id: "urlMapping",
        data: urlMapping,
        _rev: dbUrlMapping?._rev
      })
    },
    //还原域名端口
    clickRevertDomain: function () {
      let url = this.$store.state.curl.request.url;
      if (url.indexOf("?") === -1) {
        this.$store.state.curl.request.url = this.$store.state.curl.request.initUrl;
      } else {
        this.$store.state.curl.request.url = this.$store.state.curl.request.initUrl + "?" + url.split("?")[1];
      }

    },
    cancelRequest: function () {
      this.$store.commit('cancelRequest')
    },
    //刷新url
    refreshUrl(selection) {
      let argString = selection.map(arg => {
        if (arg !== undefined) {
          return arg.key + "=" + (arg.value === undefined ? "" : arg.value);
        }
      }).join("&");
      let url = this.$store.state.curl.request.url;
      //没有问号
      if (url.indexOf("?") === -1) {
        if (argString !== "") {
          this.$store.state.curl.request.url = url + "?" + argString;
        }
        return
      }
      //替换参数
      let pattern = /[^?]+$/
      let newUrl = "";
      if (pattern.test(url)) {
        newUrl = url.replace(/[^?]+$/, argString);
      } else {
        let mark = url.endsWith('?') === -1 ? "?" : "";
        newUrl = url + mark + argString;
      }
      this.$store.state.curl.request.url = newUrl
    },
    //增加参数
    addUrlArg(key) {
      console.log("addUrlArg")
      let url = this.$store.state.curl.request.url;
      if (url.indexOf('?') === -1) {
        //无问号
        this.$store.state.curl.request.url = url + "?" + key + "=";
      } else {
        //有问号
        let mark = !url.endsWith('?') && !url.endsWith('&') ? "&" : "";
        this.$store.state.curl.request.url = url + mark + key + "=";
      }
    },
    //更新url参数
    changeUrlArg(oldKey, newKey, oldValue, newValue, index) {
      console.log("changeUrlArg")

      let pattern = /[^?]+$/
      let url = this.$store.state.curl.request.url;
      let args = pattern.exec(url);
      let newArgs = args.toString().split("&").map((arg, _index) => {
        if (index === _index) {
          return newKey + "=" + newValue
        }
        return arg
      }).join("&")
      this.$store.state.curl.request.url = url.replace(pattern, newArgs)
    },
    //url变更
    urlChange: function (newUrl) {
      // let pattern = /[^?]+$/
      // let oldArg = pattern.exec(this.oldUrl)
      // let newArg = pattern.exec(newUrl)
      // console.log(oldArg, newArg)
      // if (this.oldUrl !== `${newUrl}=` && (oldArg === null ? "" : oldArg.toString()) !== (newArg === null ? "" : newArg.toString())) {
      //   console.log("newUrl", newUrl)
      // }
      this.$store.state.dom.request.syncWithUrlToArgs = true;
      this.$emit("refreshArgs", this.oldUrl, newUrl)
      this.oldUrl = newUrl;
      this.$store.state.dom.request.syncWithUrlToArgs = false;
    },

    domainReplaceChangeFocus: function () {
      if (this.replaceDomain === "") {
        this.replaceDomain = "127.0.0.1:"
      }
    },
    domainReplaceChangeBlur: function () {
      if (this.replaceDomain === "127.0.0.1:") {
        this.replaceDomain = ""
      }
    },
    refreshDomain(url) {
      // 刷新domain
      const urlObject = window.newURL(url);
      const rawUrl = urlObject.hostname + (urlObject.port === "" ? "" : ":" + urlObject.port)
      const dbUrlMapping = window.utools.db.get("urlMapping");
      if (dbUrlMapping?.data?.[rawUrl]) {
        this.replaceDomain = dbUrlMapping?.data?.[rawUrl]
      }
    }
  }
}
</script>

<style scoped>

#urlSend {
  margin-bottom: 20px;
}

.requestTypeStyle {
  width: 115px;
}

.elRow {
  margin-bottom: 10px;
  display: flex;
  justify-content: right;
}

.elCol {
  display: flex;
  justify-content: right;
}

.cursorPointer:hover {
  cursor: pointer;
}

#sendButton {
  color: white;
  background-color: #00785a;
  width: 100px;
  border-radius: 0 2px 2px 0;
}

#cancelButton {
  color: white;
  background-color: #f39c12;
  width: 100px;
  border-radius: 0 2px 2px 0;
}

#domainReplaceButton {
  color: green;
}

</style>
