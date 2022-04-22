<template>
  <el-descriptions :column=1 border size="small">
    <el-descriptions-item
        v-for="(value,key) in this.headers"
        :key="key"
        :label="`${key+':'}`"
        align="left"
        label-align="left">
      {{ value }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    headers: Object
  },
}
</script>

<style scoped>

</style>
