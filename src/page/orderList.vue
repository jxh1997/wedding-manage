<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="预约时间">
                <span>{{ props.row.yydate }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{ props.row.State }}</span>
              </el-form-item>
              <el-form-item label="用户姓名">
                <span>{{ props.row.zsname }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.tel }}</span>
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
        <el-table-column label="订单 ID" prop="id"> </el-table-column>
        <el-table-column label="婚礼标题" prop="titletext"> </el-table-column>
        <el-table-column label="婚礼价格" prop="price"> </el-table-column>
        <el-table-column label="订单状态" prop="State"></el-table-column>
        <el-table-column label="预约日期" prop="yydate"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="success"
              @click="handleTongguo(scope.$index, scope.row)"
            >
              审核通过
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

    <!-- 修改订单信息弹窗 -->
    <el-dialog
      title="修改订单"
      v-model="dialogFormVisible"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="selectTable">
        <el-form-item label="订单 ID" label-width="100px">
          <el-input
            v-model="selectTable.id"
            auto-complete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="预约时间" label-width="100px">
          <el-input v-model="selectTable.yydate"></el-input>
        </el-form-item>
        <el-form-item label="婚礼价格" label-width="100px">
          <el-input v-model="selectTable.price"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100px">
          <el-input v-model="selectTable.zsname"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px">
          <el-input v-model="selectTable.tel"></el-input>
        </el-form-item>
        <el-form-item label="婚礼标题" label-width="100px">
          <el-input v-model="selectTable.titletext" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="婚礼类型" label-width="100px">
          <el-input v-model="selectTable.hlclass" :disabled="true"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrider">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../components/headTop";

export default {
  data() {
    return {
      tableData: [],
      selectTable: {},
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
      expendRow: [],
      dialogFormVisible: false,
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
        await this.$axios.get(`/getDdinfoList`).then((res) => {
          if (res.data.code === "0") {
            this.count = res.data.count;
            this.tableData = res.data.data;
            this.tableData.map((dd) => {
              for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id === dd.id) {
                  switch (dd.tag) {
                    case "1":
                      this.tableData[i].State = "提交申请";
                      break;
                    case "2":
                      this.tableData[i].State = "待确认";
                      break;
                    case "3":
                      this.tableData[i].State = "待支付";
                      break;
                    case "4":
                      this.tableData[i].State = "已支付";
                      break;
                    case "5":
                      this.tableData[i].State = "已退款";
                      break;
                    default:
                      this.tableData[i].State = "订单状态异常";
                      break;
                  }
                }
              }

              // 请求用户信息
              this.$axios
                .get(`/getUserinfoById?id=${dd.userid}`)
                .then((userRes) => {
                  if (userRes.data.code === "0") {
                    for (var i = 0; i < this.tableData.length; i++) {
                      if (this.tableData[i].id === dd.id) {
                        this.tableData[i].username = userRes.data.data.username;
                      }
                    }
                  } else {
                    console.log(userRes.data.msg);
                  }
                });
              // 获取婚礼信息
              this.$axios.get(`/getHlinfoById?id=${dd.hlid}`).then((hlRes) => {
                if (hlRes.data.code === "0") {
                  for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].id === dd.id) {
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
            this.$message({
              message: res.data.msg,
              type: "warning",
            });
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
      this.getOrders();
    },
    async getOrders() {
      const Orders = await getOrderList({
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id,
      });
      this.tableData = [];
      Orders.forEach((item, index) => {
        const tableData = {};
        tableData.id = item.id;
        tableData.total_amount = item.total_amount;
        tableData.status = item.status_bar.title;
        tableData.user_id = item.user_id;
        tableData.restaurant_id = item.restaurant_id;
        tableData.address_id = item.address_id;
        tableData.index = index;
        this.tableData.push(tableData);
      });
    },

    // 编辑弹窗
    handleEdit(index, row) {
      this.selectTable = row;
      this.dialogFormVisible = true;
    },

    // 删除婚礼
    async handleDelete(index, row) {
      try {
        await this.$axios.get(`/delDdinfo?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "删除订单成功",
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
        console.log("删除订单失败");
      }
    },

    // 确认修改
    async updateOrider() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable);

        await this.$axios
          .post(
            `/upDdinfo?id=${this.selectTable.id}&price=${this.selectTable.price}&yydate=${this.selectTable.yydate}&zsname=${this.selectTable.zsname}&tel=${this.selectTable.tel}`
          )
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "订单信息更新成功",
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
      } catch (err) {
        console.log("订单信息更新失败", err);
      }
    },

    // 审核通过
    async handleTongguo(index, row) {
      console.log(row);
      if (row.tag === "2") {
        await this.$axios
          .post(`/upDdinfo?id=${row.id}&tag=${3}`)
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "订单审核通过，提醒用户及时支付",
              });
              this.initData();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
      } else {
        this.$message({
          type: "error",
          message: '当前订单状态无需审核',
        });
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
