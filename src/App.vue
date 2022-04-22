<template>
  <CurlLocalRequest msg="Welcome to Your Vue.js App"/>
</template>

<script>

import CurlLocalRequest from "@/components/CurlLocalRequest/CurlLocalRequest";

export default {
  name: 'App',
  components: {
    CurlLocalRequest
  }
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
}
</style>
