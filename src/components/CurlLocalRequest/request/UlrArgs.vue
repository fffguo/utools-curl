<template>
  <div>
    <el-table ref="tableDataRef"
              :data="args"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="参数名" width="300">
        <template #default="scope">
          <el-input v-model="scope.row.key" class="input-with-select" placeholder="参数名"/>
        </template>
      </el-table-column>
      <el-table-column label="参数值" property="address" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.value" class="input-with-select" placeholder="参数值"/>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "UlrArgs",
  data: function () {
    return {
      tableDataRef: ref("tableDataRef"),
      args: [],
    }
  },
  methods: {
    //刷新url参数
    refreshArgs(url) {
      let args = this.urlArgToArr(url);
      console.log("Args", args)
      this.args = args;
      this.pushEmpty();
      this.$refs.tableDataRef.toggleAllSelection();
    },
    handleSelectionChange(selection) {
      console.log("handler selection", selection)
      selection = selection.filter(sel => {
        return sel.key !== undefined && sel.key !== ""
      });
      this.$emit("parentHandle", selection)
    },
    //args末尾push空数据
    pushEmpty() {
      this.args.push({
        key: "",
        value: ""
      })
    },
    //url参数转换为数组
    urlArgToArr(url) {
      let urlArgArr = []
      url.split('?').forEach(item => {
        if (item.indexOf('=') > -1) {
          item.split('&').forEach(i => {
            if (i !== "") {
              urlArgArr.push({
                key: i.split('=')[0],
                value: i.split('=')[1]
              });
            }
          })
        }
      });
      return urlArgArr;
    },

  },

  computed: {
    startInit: function () {
      return this.$store.state.dom.request.startInit;
    },
    //监听计算 curlRequestUrl
    // curlRequestUrl: function () {
    //   return this.$store.state.curl.request.url
    // },
  },
  watch: {
    //监听初始化
    startInit: function () {
      if (this.$store.state.dom.request.startInit) {
        this.args = this.urlArgToArr(this.$store.state.curl.request.url);
        this.pushEmpty();
        this.$refs.tableDataRef.toggleAllSelection();
      }
    },
    //监听计算 curlRequestUrl
    // curlRequestUrl: function () {
    //   let url = this.$store.state.curl.request.url;
    //
    //   let urlArgMap = new Map()
    //   //url添加到map中
    //   url.split('?').forEach(item => {
    //     if (item.indexOf('=') > -1) {
    //       item.split('&').forEach(i => {
    //         urlArgMap.set(i.split('=')[0], i.split('=')[1]);
    //       })
    //     }
    //   });
    //
    //   //map转数组
    //   let urlArgArr = []
    //   for (let key of urlArgMap.keys()) {
    //     urlArgArr.push({
    //       key: key,
    //       value: urlArgMap.get(key)
    //     })
    //   }
    //   this.$data.args = urlArgArr
    //
    //   //处理勾选
    //   this.$data.args.forEach((item, index) => {
    //     this.$nextTick(() => {
    //       if (urlArgMap.has(item.key)) {
    //         this.$refs.tableDataRef.toggleRowSelection(this.$data.args[index], true);
    //       }
    //     });
    //   })
    //
    // },

    // args: function (value) {
    //   console.log("args")
    //   console.log(value)
    //   console.log(this.args)
    //
    // },

  }
}
</script>

<style scoped>

</style>
