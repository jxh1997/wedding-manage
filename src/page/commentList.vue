<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="评论内容">
                <span>{{ props.row.textinfo }}</span>
              </el-form-item>
              <el-form-item label="发布时间">
                <span>{{ props.row.fbtime }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="用户昵称">
                <span>{{ props.row.nickname }}</span>
              </el-form-item>
              <el-form-item label="婚礼标题">
                <span>{{ props.row.titletext }}</span>
              </el-form-item>
              <el-form-item label="婚礼类型">
                <span>{{ props.row.hlclass }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="婚礼标题" prop="titletext"> </el-table-column>
        <el-table-column label="评论内容" prop="textinfo"> </el-table-column>
        <el-table-column label="发布时间" prop="fbtime"> </el-table-column>
        <el-table-column label="发布者" prop="username"> </el-table-column>
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
      hlData: [],
      expendRow: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
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
            this.count = res.data.count;
            this.tableData = res.data.data;
            this.tableData.map((pl) => {
              // 请求用户信息
              this.$axios
                .get(`/getUserinfoById?id=${pl.userid}`)
                .then((userRes) => {
                  if (userRes.data.code === "0") {
                    for (var i = 0; i < this.tableData.length; i++) {
                      if (this.tableData[i].id === pl.id) {
                        this.tableData[i].username = userRes.data.data.username;
                        this.tableData[i].nickname = userRes.data.data.nickname;
                      }
                    }
                  } else {
                    console.log(userRes.data.msg);
                  }
                });
              // 获取婚礼信息
              this.$axios.get(`/getHlinfoById?id=${pl.hlid}`).then((hlRes) => {
                if (hlRes.data.code === "0") {
                  for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].id === pl.id) {
                      this.tableData[i].titletext = hlRes.data.data.titletext;
                      this.tableData[i].hlclass = hlRes.data.data.hlclass;
                    }
                  }
                } else {
                  console.log(hlRes.data.msg);
                }
              });
            });
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
