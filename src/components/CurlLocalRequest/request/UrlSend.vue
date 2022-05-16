<template>

  <div id="urlSend">
    <el-input v-model="requestUrl"
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
    requestUrl: function () {
      return this.$store.state.curl.request.url;
    },
  },
  data: function () {
    return {
      url: "",
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
      let argString = selection.map(arg => {
        if (arg !== undefined) {
          return arg.key + "=" + (arg.value === undefined ? "" : arg.value);
        }
      }).join("&");

      //替换参数
      let pattern = /[^?]+$/
      let url = this.$store.state.curl.request.url;
      if (pattern.test(url)) {
        console.log("replace", argString, url, url.replace(/[^?]+$/, argString));
        this.$store.state.curl.request.url = url.replace(/[^?]+$/, argString)
      } else {
        let mark = url.indexOf('?') === -1 ? "?" : ""
        this.$store.state.curl.request.url = url + mark + argString
      }
    },

    urlChange: function (newUrl) {
      this.$store.state.curl.request.url = newUrl
      this.$emit("parentHandle", newUrl)
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
