<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="100" label="序号"> </el-table-column>
        <el-table-column property="lastlogin" label="最后登录时间">
        </el-table-column>
        <el-table-column property="username" label="用户名">
        </el-table-column>
        <el-table-column property="nickname" label="昵称"> </el-table-column>
        <el-table-column property="groupid" label="用户组"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
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
      tableData: [],
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
              this.tableData = res.data.data;
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
    // 删除用户
    async handleDelete(row) {
      try {
        await this.$axios.get(`/delUserinfo?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "用户删除成功",
            });
            this.initData();
          } else {
            throw new Error(res.data.msg);
          }
        });
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message,
        });
        console.log("用户删除失败");
      }
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
