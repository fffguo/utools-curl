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
                    v-on:input="handleKeyChange"/>
        </template>
      </el-table-column>
      <el-table-column label="参数值" show-overflow-tooltip>
        <template #default="scope">
          <el-input v-model="scope.row.value" class="input-with-select" placeholder="参数值"
                    v-on:focus="this.argTempOldValue=scope.row.value;this.onfocusScope=scope"
                    v-on:input="handleValueChange"/>
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
    refreshArgs(oldUrl, newUrl) {
      let oldArgs = this.urlArgToArr(oldUrl);
      let newArgs = this.urlArgToArr(newUrl);


      console.log("refreshArgs", oldArgs, newArgs);
      //新增参数处理
      newArgs.forEach((newArg, index) => {
        let rows = this.getSelectRows();

        let oldArg = oldArgs[index];
        if (oldArg === undefined) {
          //新增
          console.log("新增", newArg, index, JSON.stringify(rows));
          this.pushRow(newArg.key, newArg.value, true, index);
          console.log("新增222", JSON.stringify(this.getSelectRows()));

        } else {
          if (oldArg.key !== newArg.key || oldArg.value !== newArg.value) {
            if (rows[index] !== undefined && rows.key !== "" && rows.value !== "") {
              console.log("rows1111", JSON.stringify(this.getSelectRows()), index)

              rows[index].key = newArg.key;
              rows[index].value = newArg.value;
              rows[index].showDel = true;
              console.log("rows", JSON.stringify(this.getSelectRows()))

              this.$refs.tableDataRef.toggleRowSelection(rows[index], true)
            }
          }
        }
      })
      //删除参数处理
      oldArgs.forEach((oldArg, index) => {
        let newArg = newArgs[index];
        if (newArg === undefined) {
          console.log("删除", oldArg, index, JSON.stringify(this.getSelectRows()));
          this.delRow(this.getSelectRows()[index].index);
        }
      })
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(selection) {
      if (this.$store.state.dom.request.syncWithUrlToArgs === true) {
        return;
      }
      selection = this.getSelectRows().filter(sel => {
        return sel !== undefined && sel.key !== undefined && sel.key !== ""
      });
      this.$emit("refreshUrl", selection)
    },
    //参数key发生变化时触发
    handleKeyChange(newKey) {
      console.log("xxx", this.$store.state.dom.request.syncWithUrlToArgs)
      if (this.$store.state.dom.request.syncWithUrlToArgs === true) {
        return;
      }
      this.onfocusScope.row.showDel = true;
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
      if (this.$store.state.dom.request.syncWithUrlToArgs === true) {
        return;
      }
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
        if (item.index === index) {
          args.splice(_index, 1);
        }
      });
    },

    pushRow(key, value, showDel, location) {
      let locationIndex = this.args[location].index
      let locationPreviousIndex = this.args[location - 1] === undefined ? locationIndex - 1 : this.args[location - 1].index
      //添加一行
      this.args.splice(location, 0, {
        key: key === undefined ? "" : key,
        value: value === undefined ? "" : value,
        index: locationPreviousIndex + (locationIndex - locationPreviousIndex) / 2,
        showDel: showDel === undefined ? false : showDel
      })
      //勾选最后一行空行
      let lastEmptyRow = this.$refs.tableDataRef.data[location]
      this.$refs.tableDataRef.toggleRowSelection(lastEmptyRow, true)
    },
    //args末尾push空数据
    pushEmpty() {
      let maxIndex = 0;
      if (this.args.length > 0) {
        maxIndex = Math.max.apply(Math, this.args.map(arg => arg.index))
      }
      //添加一行
      this.args.push({
        key: "",
        value: "",
        index: maxIndex + 1,
        showDel: false
      })
      //勾选最后一行空行
      let lastEmptyRow = this.$refs.tableDataRef.data[this.$refs.tableDataRef.data.length - 1]
      this.$refs.tableDataRef.toggleRowSelection(lastEmptyRow, true)
    },
    //url参数转换为数组
    urlArgToArr(url) {
      let urlArgArr = []
      if (url.indexOf("?") !== -1) {
        let args = url.split('?')[1];
        args.split('&').forEach((i, index) => {
          if (i !== "" && i !== undefined) {
            let arg = i.split('=');
            if (arg !== undefined && arg !== "" && arg[0] !== "") {
              urlArgArr.push({
                key: arg[0],
                value: arg[1] !== undefined ? arg[1] : "",
                index: index,
                showDel: true
              });
            }
          }
        })
      }
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
        //更新vuex
        this.$store.state.dom.request.urlArgsTableRef = this.$refs.tableDataRef
        this.$store.state.dom.request.startInit = false

      }
    },
  }
}
</script>

<style scoped>

</style>
