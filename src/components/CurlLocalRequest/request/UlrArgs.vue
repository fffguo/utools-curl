<template>
  <div>
    <el-table ref="tableDataRef"
              :data="args"
              style="width: 100%"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="参数名" width="250">
        <template #default="scope">
          <el-input v-model="scope.row.key" class="input-with-select"
                    placeholder="参数名"
                    v-on:focus="this.argTempOldKey=scope.row.key;this.onfocusScope=scope"
                    v-on:input="handleKeyChange"
          />
        </template>
      </el-table-column>
      <el-table-column label="参数值" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.value" class="input-with-select" placeholder="参数值"
                    v-on:focus="this.argTempOldValue=scope.row.value;this.onfocusScope=scope"
                    v-on:input="handleValueChange"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template #default="scope">
          <el-button v-show="scope.row.showDel" v-on:click="delRow(scope.row.index)">删除</el-button>
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
      argTempOldKey: "",
      argTempOldValue: "",
      onfocusScope: null
    }
  },
  methods: {
    //刷新url参数
    refreshArgs(url) {
      this.args = this.urlArgToArr(url);
      this.pushEmpty();
      this.$refs.tableDataRef.toggleAllSelection();
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(selection) {
      selection = this.getSelectRows().filter(sel => {
        return sel !== undefined && sel.key !== undefined && sel.key !== ""
      });
      this.$emit("refreshUrl", selection)
    },
    //参数key发生变化时触发
    handleKeyChange(newKey) {
      this.onfocusScope.row.showDel = true
      //当前行未被勾选，不做处理
      if (this.$refs.tableDataRef.getSelectionRows().indexOf(this.onfocusScope.row) === -1) {
        return;
      }
      if (this.argTempOldKey === "") {
        //新增的key
        this.$emit("addUrlKey", newKey);
      } else {
        //更新url
        this.$emit("changeUrlArg", this.argTempOldKey, newKey, this.onfocusScope.row.value, this.onfocusScope.row.value, this.getSelectRows().indexOf(this.onfocusScope.row));
      }
      //更新旧值
      this.argTempOldKey = newKey;
      //添加新行
      if (this.onfocusScope.$index === this.args.length - 1) {
        this.pushEmpty();
      }
    },
    //参数value发生变化时触发
    handleValueChange(newValue) {
      this.onfocusScope.row.showDel = true
      if (this.onfocusScope.row.key !== "") {
        //更新url
        this.$emit("changeUrlArg", this.onfocusScope.row.key, this.onfocusScope.row.key, this.argTempOldValue, newValue, this.getSelectRows().indexOf(this.onfocusScope.row));
      }
      //更新旧值
      this.argTempOldValue = newValue;
      //添加新行
      if (this.onfocusScope.$index === this.args.length - 1) {
        this.pushEmpty();
      }
    },
    //删除行
    delRow(index) {
      this.args.forEach((item, _index, args) => {
        console.log(item, _index, args);
        if (item.index === index) {
          args.splice(_index, 1);
        }
      });
    },
    //args末尾push空数据
    pushEmpty() {
      this.args.max
      //添加一行
      this.args.push({
        key: "",
        value: "",
        index: Math.max.apply(Math, this.args.map(arg => arg.index)) + 1,
        showDel: false
      })
      //勾选最后一行空行
      let lastEmptyRow = this.$refs.tableDataRef.data[this.$refs.tableDataRef.data.length - 1]
      this.$refs.tableDataRef.toggleRowSelection(lastEmptyRow, true)
    },
    //url参数转换为数组
    urlArgToArr(url) {
      let urlArgArr = []
      url.split('?').forEach(item => {
        if (item.indexOf('=') > -1) {
          item.split('&').forEach((i, index) => {
            if (i !== "" && i !== undefined) {
              urlArgArr.push({
                key: i.split('=')[0],
                value: i.split('=')[1] !== undefined ? i.split('=')[1] : "",
                index: index,
                showDel: true
              });
            }
          })
        }
      });
      return urlArgArr;
    },

    getSelectRows() {
      return this.$refs.tableDataRef.getSelectionRows().sort((row1, row2) => {
        return row1.index - row2.index
      });
    }

  },

  computed: {
    startInit: function () {
      return this.$store.state.dom.request.startInit;
    },
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
  }
}
</script>

<style scoped>

</style>
