<template>
  <div ref="previewContainer"></div>
</template>

<script>
export default {
  name: "ResponsePreview",
  watch:{
    '$store.state.curl.response.body'(newVal){
      this.renderContent(newVal)
    }
  },
  methods:{
    renderContent(htmlStr){
      let iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "400px";
      iframe.style.border = "none";
      this.$refs.previewContainer.innerHTML = "";
      this.$refs.previewContainer.append(iframe)
      iframe.onload = function (){
        if(iframe.contentDocument.body.scrollHeight > 400){
          // 自适应 iframe 初始DOM 高度 不显示时获取不到
          iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
        }
      }
      let iframeDocumnet = iframe.contentDocument
      iframeDocumnet.open();
      iframeDocumnet.write(htmlStr)
      iframeDocumnet.close()
    }
  },
  mounted() {
    this.renderContent(this.$store.state.curl.response.body)
  }
}
</script>

<style scoped>

</style>