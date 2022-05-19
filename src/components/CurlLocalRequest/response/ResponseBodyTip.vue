<template>
  <div id="returnResultTip" :style="style">
    <div id="httpStatus">
      状态码: {{ httpStatus }}
    </div>
    <div id="consumeTime">
      耗时: {{ consumeTime }}ms
    </div>
  </div>
</template>

<script>

export default {
  name: "ResponseBodyTip",
  data: function () {
    return {
      style: {
        backgroundColor: "#00785a",
      },
      supportColor: {
        success: "#00785a",
        warning: "#f39c12",
        danger: "#e74c3c",
      }
    }
  },
  computed: {
    httpStatus() {
      return this.$store.state.curl.response.httpStatus;
    },
    consumeTime() {
      return this.$store.state.curl.response.consumeTime;
    },
  },
  watch: {
    httpStatus: function (newValue) {
      if (newValue === 200) {
        this.style.backgroundColor = this.supportColor.success
      } else if (newValue === 404 || newValue === 500) {
        this.style.backgroundColor = this.supportColor.danger
      } else {
        this.style.backgroundColor = this.supportColor.warning
      }
    },
  }
}
</script>

<style scoped>
#returnResultTip {
  height: 30px;
  color: white;
  border-radius: 4px;
  padding: 10px 10px 0 10px;
  margin-bottom: 10px;
}


#httpStatus {
  float: left;
}

#consumeTime {
  float: right;
}
</style>
