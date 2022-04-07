<template>

  <el-button id="addButtonStyle" type="primary" @click="addButton">
    新增
  </el-button>
  <!--对话框-->
  <el-dialog v-model="addOrEditDialog" :title="addOrEditTitle" width="50%">
    <el-form id="addOrEditDialogForm" :model="addOrEditForm" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="addOrEditForm.name"/>
      </el-form-item>
      <el-form-item label="域名/IP">
        <el-input v-model="addOrEditForm.domain"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submit()">{{ addOrEditSubmit }}</el-button>
      </span>
    </template>
  </el-dialog>

  <el-table :data="tableData" border stripe style="width: 100%;align-content: center">
    <el-table-column label="名称" prop="name"/>
    <el-table-column label="域名" prop="domain"/>
    <el-table-column label="启用/禁用">
      <template #default="scope">
        <el-switch
            v-model="scope.row.onOff"
            active-color="#13ce66"
            class="ml-2"
            inactive-color="#ff4949"
            @click="switchOnOff(scope.row)"
        />
      </template>

    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="editButton(scope.row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>


</template>
<script>
import * as child_process from "child_process";

const db_key = "curl_domain_config_list"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      //新增对话框
      addOrEditDialog: false,
      addOrEditTitle: "",
      addOrEditSubmit: "",
      //新增或编辑对话框数据
      addOrEditForm: {
        id: "",
        version: "",
        name: "",
        domain: "",
        onOff: ""
      },
      //表格数据
      tableData: [
        {
          id: "0",
          name: 'Localhost',
          domain: '127.0.0.1',
          onOff: true,
          version: "0",
        },
      ],
    }
  },
  methods: {
    //新增按钮
    addButton: function () {
      this.addOrEditDialog = true
      this.addOrEditTitle = "新增映射"
      this.addOrEditSubmit = "新增"
      this.addOrEditForm.id = "";
      this.addOrEditForm.name = "";
      this.addOrEditForm.domain = "";
      this.addOrEditForm.onOff = true;
      this.addOrEditForm.version = "0";
    },
    //编辑按钮
    editButton: function (item) {
      this.addOrEditDialog = true
      this.addOrEditTitle = "编辑映射"
      this.addOrEditSubmit = "保存"
      this.addOrEditForm.id = item.id;
      this.addOrEditForm.name = item.name;
      this.addOrEditForm.domain = item.domain;
      this.addOrEditForm.onOff = item.onOff;
      this.addOrEditForm.version = item.version;
    },
    //停用启用
    switchOnOff: function (item) {
      window.utools.db.put({
        _id: item.id,
        data: JSON.stringify(item),
        _rev: item.version
      })
    },

    //删除
    handleDelete: function (id) {
      window.utools.db.remove(id)
      this.tableData.forEach(function (item, index, arr) {
        if (item.id === id) {
          arr.splice(index, 1)
        }
      })
    },
    //提交
    submit: function () {
      this.addOrEditDialog = false;
      let dbInfo
      //新增
      if (this.addOrEditForm.id === "") {
        this.addOrEditForm.id = db_key + "_" + Math.ceil(Math.random() * 1000000)
        //双写
        dbInfo = window.utools.db.put({
          _id: this.addOrEditForm.id,
          data: JSON.stringify(this.addOrEditForm),
        });
        this.tableData.unshift({
          id: dbInfo.id,
          name: this.addOrEditForm.name,
          domain: this.addOrEditForm.domain,
          onOff: this.addOrEditForm.onOff,
          version: dbInfo.rev,
        })
      }
      //编辑
      else {
        dbInfo = window.utools.db.put({
          _id: this.addOrEditForm.id,
          data: JSON.stringify(this.addOrEditForm),
          _rev: this.addOrEditForm.version
        });
        this.tableData.forEach(item => {
          if (item.id === dbInfo.id) {
            item.name = this.addOrEditForm.name
            item.domain = this.addOrEditForm.domain
            item.onOff = this.addOrEditForm.onOff
            item.version = dbInfo.rev
          }
        })
      }

    },
  },
  mounted() {
    window.vue = this;
    //初始化值
    window.utools.onPluginEnter(() => {
      this.tableData = []
      for (const item of window.utools.db.allDocs(db_key)) {
        const data = JSON.parse(item.data);
        this.tableData.push({
          id: item._id,
          name: data.name,
          domain: data.domain,
          onOff: data.onOff,
          version: item._rev,
        });
      }
    })

    //直接调用
    child_process.exec("", function (err, stdout, stderr) {
      console.log(stdout);
      console.log("==========================");
      console.log(err);
      console.log("==========================");
      console.log(stderr);
    });
  }

}
</script>

<style scoped>

#addOrEditDialogForm {
  margin-right: 60px;
}

#addButtonStyle {
  float: right;
  margin-bottom: 15px
}
</style>
