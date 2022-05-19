<template>
  <div>
    <el-table ref="tableDataRef"
              :data="headerList"
              max-height="250"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="参数名" width="300">
        <template #default="scope">
          <el-input v-model="scope.row.key" class="input-with-select" placeholder="key"
                    v-on:focus="this.onfocusScope=scope"
                    v-on:input="handleRowChange"
          />
        </template>

      </el-table-column>
      <el-table-column label="参数值" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.value" class="input-with-select" placeholder="value"
                    v-on:focus="this.onfocusScope=scope"
                    v-on:input="handleRowChange"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-button v-show="scope.row.showDel" type="danger" v-on:click="delRow(scope.row.index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "RequestHeaders",
  data: function () {
    return {
      tableDataRef: ref("tableDataRef"),
      headerList: [],
      onfocusScope: null
    }
  },
  computed: {
    startInit: function () {
      return this.$store.state.dom.request.startInit;
    },
  },
  watch: {
    startInit: function (val) {
      if (val) {
        this.headerList = this.getHeadersTableData()
        this.$refs.tableDataRef.toggleAllSelection();
        this.pushEmpty();
        //更新vuex
        this.$store.state.dom.request.requestHeaderTableRef = this.$refs.tableDataRef
      }
    }
  },
  mounted() {
  },
  methods: {
    //参数value发生变化时触发
    handleRowChange() {
      this.onfocusScope.row.showDel = true
      //添加新行
      if (this.onfocusScope.$index === this.headerList.length - 1) {
        this.pushEmpty();
      }
    },
    //删除行
    delRow(index) {
      this.headerList.forEach((item, _index, headers) => {
        if (item.index === index) {
          headers.splice(_index, 1);
        }
      });
    },
    //args末尾push空数据
    pushEmpty() {
      let maxIndex = 0;
      if (this.headerList.length > 0) {
        maxIndex = Math.max.apply(Math, this.headerList.map(arg => arg.index))
      }
      //添加一行
      this.headerList.push({
        key: "",
        value: "",
        index: maxIndex + 1,
        showDel: false
      })
      //勾选最后一行空行
      let lastEmptyRow = this.$refs.tableDataRef.data[this.$refs.tableDataRef.data.length - 1]
      this.$refs.tableDataRef.toggleRowSelection(lastEmptyRow, true)
    },
    getHeadersTableData: function () {
      let headers = this.$store.state.curl.request.headers;
      let headerArr = [];
      for (const header in headers) {
        headerArr.push({
          key: header,
          value: headers[header],
          index: headerArr.length,
          showDel: true
        })
      }
      return headerArr
    },
  }
}
</script>

<style scoped>

</style>
