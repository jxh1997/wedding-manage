<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="100"> </el-table-column>
        <el-table-column property="lastlogin_time" label="最后登录时间" width="220">
        </el-table-column>
        <el-table-column property="username" label="用户名" width="220">
        </el-table-column>
        <el-table-column property="nickname" label="昵称"> </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";

export default {
  data() {
    return {
      tableData: [
        {
          lastlogin_time: "2020-05-02",  // 最后登录时间
          username: "王小虎",  // 用户名
          nickname: '',  // 昵称
          imgpath: ''
        },
      ],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
    };
  },
  components: {
    headTop,
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        await this.$axios
          .post(`/getUserList`)
          .then((res) => {
            console.log(res);
            let userList = res.data.data;
            this.tableData = [];
            this.$data.count = userList.length;
            if (res.data.code === "0") {
              userList.forEach((item) => {
                const tableData = {};
                tableData.username = item.username;
                tableData.lastlogin_time = item.lastlogin;
                tableData.nickname = item.nickname;
                this.tableData.push(tableData);
              });
            } else{
                throw new Error('获取数据失败');
            }
          });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getUsers();
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
</style>
