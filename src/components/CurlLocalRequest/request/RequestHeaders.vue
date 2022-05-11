<template>
  <div>
    <el-table ref="tableDataRef"
              :data="tableDataList"
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
  name: "RequestHeaders",
  props: {
    tableDataList: {
      type: Array,
      default: () => [{
        key: "",
        value: ""
      }]
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
        this.$refs.tableDataRef.toggleAllSelection();
      }
    }
  },
  data() {
    return {
      tableDataRef: ref("tableDataRef")
    }
  },
  mounted() {
  },
  methods: {
    handleSelectionChange() {
    }
  }
}
</script>

<style scoped>

</style>
