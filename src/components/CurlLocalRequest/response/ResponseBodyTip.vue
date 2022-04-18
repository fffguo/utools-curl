<template>
  <div id="returnResultTip" :style="style">
    <div id="httpStatus">
      状态码: {{ httpStatus }}
    </div>
    <div id="consumeTime">
      耗时: {{ consumeTime }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ResponseBodyTip",
  data: function () {
    return {
      httpStatus: this.$store.state.curl.response.httpStatus,
      consumeTime: "900ms",
      style: {
        backgroundColor: "",
      },
      supportColor: {
        success: "#00785a",
        warning: "#f39c12",
        danger: "#e74c3c",
      }
    }
  },
  watch: {
    httpStatus: function (newValue) {
      if (newValue === 200) {
        this.style.backgroundColor = this.supportColor.success
      } else if (newValue === 404) {
        this.style.backgroundColor = this.supportColor.danger
      } else if (newValue === 500) {
        this.style.backgroundColor = this.supportColor.danger
      } else {
        this.style.backgroundColor = this.supportColor.warning
      }
    }
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
