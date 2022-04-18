<template>
  <el-descriptions border column="1" size="small">
    <el-descriptions-item
        v-for="(value,key) in this.$store.state.curl.response.headers"
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
  name: "ResponseHeader"
}
</script>

<style scoped>

</style>
