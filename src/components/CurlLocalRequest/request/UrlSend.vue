<template>

  <div id="urlSend">
    <el-row class="elRow">
      <el-col :span="4" class="elCol">
        <div class="grid-content bg-purple-dark cursorPointer" v-on:click="clickRevertDomain">
          <el-tag class="ml-2">还原域名</el-tag>
        </div>
      </el-col>
      <el-col :span="5" class="elCol">
        <div class="grid-content bg-purple-dark cursorPointer" v-on:click="clickReplaceLocalhost">
          <el-tag class="ml-2" type="success">域名替换127.0.0.1:8080</el-tag>
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
        <el-button v-show="!loading" id="sendButton" size="large" type="primary" v-on:click="sendRequest">发送</el-button>
        <el-button v-show="loading" id="cancelButton" class="cursorPointer" size="large" type="primary"
                   v-on:click="cancelRequest">取消
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script>

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
    }
  },
  watch: {
    //初始化
    startInit: function () {
      if (this.$store.state.dom.request.startInit) {
        this.url = this.$store.state.curl.request.url;
      }
    },
  },
  methods: {

    //发送请求
    sendRequest: function () {
      //处理header
      let headerRows = this.$store.state.dom.request.requestHeaderTableRef.getSelectionRows();
      let headers = {}
      headerRows
          .filter(header => header !== undefined && header.key !== undefined && header.key !== "" && header.value !== undefined)
          .forEach(header => headers[header.key] = header.value);
      //处理body
      let body = this.$store.state.ace.requestBodyEditor.getValue();
      if (this.$store.state.ace.requestBodyMode === this.$store.state.ace.supportedLanguage.json) {
        if (body !== undefined && body !== "") {
          body = JSON.stringify(JSON.parse(body));
        }
      }
      //构造请求
      let curlArgs = {
        url: this.$store.state.curl.request.url,
        method: this.$store.state.curl.request.method,
        headers: headers,
        body: body,
      }
      //发送请求
      this.$store.commit('sendRequest', curlArgs)
    },
    //替换域名端口
    clickReplaceLocalhost: function () {
      let url = this.$store.state.curl.request.url;
      let urlObject = window.newURL(url);
      this.$store.state.curl.request.url = url.replace(urlObject.hostname + urlObject.port, "127.0.0.1:8080")
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
  }
}
</script>

<style scoped>

#urlSend {
  margin-bottom: 20px;
}

.requestTypeStyle {
  width: 115px;
  margin-left: 20px;
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

</style>
