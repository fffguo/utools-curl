<template>
  <div>
    <AceEditor :read-only="false" editorName="requestBodyEditor"/>

  </div>

</template>

<script>

import AceEditor from '@/components/ace/AceEditor'

export default {
  name: "RequestBody",
  components: {
    AceEditor
  },
}
</script>

<style scoped>

</style>
