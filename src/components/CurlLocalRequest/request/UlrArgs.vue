<template>
  <div>
    <el-table ref="tableDataRef"
              :data="args"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="参数名" width="300">
        <template #default="scope">
          <el-input v-model="scope.row.key" class="input-with-select" placeholder="key"/>
        </template>

      </el-table-column>
      <el-table-column label="参数值" property="address" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.value" class="input-with-select" placeholder="value"/>
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
  computed: {
    startInit: function () {
      return this.$store.state.dom.request.startInit;
    },
    curlRequestUrl: function () {
      return this.$store.state.curl.request.url
    },
  },
  watch: {
    // curlRequestUrl: function (val) {
    //   if (val) {
    //     this.$refs.tableDataRef.toggleAllSelection();
    //   }
    // },
    curlRequestUrl: function () {
      let url = this.$store.state.curl.request.url;
      console.log("url" + url)

      let urlArgMap = new Map()
      //url添加到map中
      url.split('?').forEach(item => {
        if (item.indexOf('=') > -1) {
          item.split('&').forEach(i => {
            urlArgMap.set(i.split('=')[0], i.split('=')[1]);
          })
        }
      });

      //将老参数继续添加到map中
      // this.$data.args.forEach(item => {
      //   if (!urlArgMap.has(item.key)) {
      //     urlArgMap.set(item.key, item.value);
      //   }
      // })

      //map转数组
      let urlArgArr = []
      for (let key of urlArgMap.keys()) {
        urlArgArr.push({
          key: key,
          value: urlArgMap.get(key)
        })
      }
      this.$data.args = urlArgArr


      //处理勾选
      this.$data.args.forEach((item, index) => {
        this.$nextTick(() => {
          if (urlArgMap.has(item.key)) {
            this.$refs.tableDataRef.toggleRowSelection(this.$data.args[index], true);
          }
        });
      })

    },
    methods: {
      handleSelectionChange() {
        console.log("change")
      },
      //url参数是否包含某个元素
      argsIndexOf(item) {
        for (let i = 0; i < this.args.length; i++) {
          if (this.args[0] === item) {
            return i;
          }
        }
        return -1;
      },
      //url参数转换为map
      urlArgToMap(url) {
        let urlArgMap = new Map()

        url.split('?').forEach(item => {
          if (item.indexOf('=') > -1) {
            item.split('&').forEach(i => {
              urlArgMap.set(i.split('=')[0], i.split('=')[1]);
            })
          }
        });
        return urlArgMap;
      },

      //url参数转换为数组
      urlArgToArr() {
        let urlArgArr = []
        this.$store.state.curl.request.url.split('?').forEach(item => {
          if (item.indexOf('=') > -1) {
            item.split('&').forEach(i => {
              urlArgArr.push({
                key: i.split('=')[0],
                value: i.split('=')[1]
              })
            })
          }
        });
        return urlArgArr;
      },
    }
  }
}
</script>

<style scoped>

</style>
