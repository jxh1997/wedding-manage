<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        :data="tableData"
        @expand="expand"
        :expand-row-keys="expendRow"
        :row-key="(row) => row.index"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="婚礼标题">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="评论内容">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="发布时间">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="婚礼标题" prop="hl_title"> </el-table-column>
        <el-table-column label="评论内容" prop="textinfo"> </el-table-column>
        <el-table-column label="发布时间" prop="fbtime"> </el-table-column>
        <el-table-column label="发布者" prop="userid"> </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";

export default {
  data() {
    return {
      tableData: [],
      hlData: [],
      currentRow: null,
      currentPage: 1,
      restaurant_id: null,
      expendRow: [],
    };
  },
  components: {
    headTop,
  },
  created() {
    this.restaurant_id = this.$route.query.restaurant_id;
    this.initData();
  },

  methods: {
    async initData() {
      try {
        await this.$axios.get(`/getPlInfoList`).then((res) => {
          if (res.data.code === "0") {
            this.tableData = res.data.data;
          } else {
            throw new Error("获取数据失败");
          }
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },

    async expand(row, status) {
      if (status) {
        const restaurant = await getResturantDetail(row.restaurant_id);
        const userInfo = await getUserInfo(row.user_id);
        const addressInfo = await getAddressById(row.address_id);

        this.tableData.splice(row.index, 1, {
          ...row,
          ...{
            restaurant_name: restaurant.name,
            restaurant_address: restaurant.address,
            address: addressInfo.address,
            user_name: userInfo.username,
          },
        });
        this.$nextTick(() => {
          this.expendRow.push(row.index);
        });
      } else {
        const index = this.expendRow.indexOf(row.index);
        this.expendRow.splice(index, 1);
      }
    },

    // 删除评论
    async handleDelete(index, row) {
      try {
        await this.$axios.get(`/delPlinfo?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "删除评论成功",
            });
            this.tableData.splice(index, 1);
          } else {
            throw new Error(res.data.msg);
          }
        });
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message,
        });
        console.log("删除评论失败");
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
