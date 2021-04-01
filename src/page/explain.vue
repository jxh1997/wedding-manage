<template>
  <div class="fillcontain">
    <head-top></head-top>
    <p class="explain_text">本后台管理系统是基于 Vue + elm 而实现</p>
    <p class="explain_text">管理员用户名为 admin</p>
    <p class="explain_text">管理员密码为 admin</p>
  </div>
</template>

<script>
import headTop from "../components/headTop";
export default {
  components: {
    headTop,
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.explain_text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
}
</style>
