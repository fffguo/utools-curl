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
  background: white;
  margin: -7px;
  padding: 10px 12px 20px 7px;
  overflow-x: hidden;
  border-radius: 0.5%
}
</style>
