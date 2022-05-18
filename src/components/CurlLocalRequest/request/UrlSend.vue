<template>

  <div id="urlSend">
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
        <el-button v-show="loading" id="cancelButton" size="large" type="primary" v-on:click="cancelRequest">取消
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
      this.$store.commit('sendRequest')
    },
    cancelRequest: function () {
      this.$store.commit('cancelRequest')
    },
    //刷新url
    refreshUrl(selection) {
      console.log("selection", selection)
      let argString = selection.map(arg => {
        if (arg !== undefined) {
          return arg.key + "=" + (arg.value === undefined ? "" : arg.value);
        }
      }).join("&");

      //替换参数
      let pattern = /[^?]+$/
      let url = this.$store.state.curl.request.url;
      if (pattern.test(url)) {
        this.$store.state.curl.request.url = url.replace(/[^?]+$/, argString)
      } else {
        let mark = url.endsWith('?') === -1 ? "?" : ""
        this.$store.state.curl.request.url = url + mark + argString
      }
    },
    //增加参数
    addUrlArg(key) {
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
      if (this.oldUrl !== `${newUrl}=`) {
        this.$emit("refreshArgs", newUrl)
      }
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

#cancelButton:hover {
  cursor: pointer;
}

</style>
