<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <!-- 婚礼信息展示 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="婚礼名称">
                <span>{{ props.row.titletext }}</span>
              </el-form-item>
              <el-form-item label="婚礼简介">
                <span>{{ props.row.infotext }}</span>
              </el-form-item>
              <el-form-item label="婚礼详情">
                <span>{{ props.row.infotext }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="评论数">
                <span>{{ props.row.dzlist }}</span>
              </el-form-item>
              <el-form-item label="点赞数">
                <span>{{ props.row.dzlist }}</span>
              </el-form-item>
              <el-form-item label="婚礼类型">
                <span>{{ props.row.hlclass }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- 婚礼信息展示 -->
        <el-table-column label="婚礼名称" prop="titletext"> </el-table-column>
        <el-table-column label="婚礼简介" prop="infotext"> </el-table-column>
        <el-table-column label="婚礼类型" prop="hlclass"> </el-table-column>
        <el-table-column label="婚礼价格" prop="price"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="Success"
              @click="addFood(scope.$index, scope.row)"
            >
              添加婚礼
            </el-button>
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

      <!-- 修改婚礼信息弹窗 -->
      <el-dialog
        title="修改婚礼信息"
        v-model="dialogFormVisible"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="selectTable">
          <el-form-item label="婚礼名称" label-width="100px">
            <el-input
              v-model="selectTable.titletext"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="婚礼简介" label-width="100px">
            <el-input v-model="selectTable.infotext"></el-input>
          </el-form-item>
          <el-form-item label="婚礼详情" label-width="100px">
            <el-input type="textarea" v-model="selectTable.infotext"></el-input>
          </el-form-item>
          <el-form-item label="婚礼类型" label-width="100px">
            <el-select
              v-model="selectTable.hlclass"
              :placeholder="selectTable.hlclass"
            >
              <el-option
                v-for="item in weddingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="婚礼价格"
            style="white-space: nowrap"
            label-width="100px"
          >
            <el-input
              v-model="selectTable.price"
              style="width: 100px"
            ></el-input>
          </el-form-item>

          <el-form-item label="婚礼图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="selectTable.imgpath"
                :src="selectTable.imgpath"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateWedding">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";

export default {
  data() {
    return {
      baseUrl: "/test/uploadfile",
      tableData: [],
      selectTable: {},
      dialogFormVisible: false,
      weddingOptions: [
        {
          value: "西式婚礼",
          label: "西式婚礼",
        },
        {
          value: "中西合壁式婚礼",
          label: "中西合壁式婚礼",
        },
        {
          value: "自助餐式婚礼",
          label: "自助餐式婚礼",
        },
        {
          value: "公证式结婚",
          label: "公证式结婚",
        },
        {
          value: "新潮婚礼",
          label: "新潮婚礼",
        },
        {
          value: "现代流行式婚礼",
          label: "现代流行式婚礼",
        },
        {
          value: "集体婚礼",
          label: "集体婚礼",
        },
        {
          value: "传统婚礼",
          label: "传统婚礼",
        },
        {
          value: "民族特色婚礼",
          label: "民族特色婚礼",
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  components: {
    headTop,
  },
  methods: {
    // 获取婚礼信息
    async initData() {
      try {
        await this.$axios.get(`/getHlInfoList`).then((res) => {
          console.log("婚礼信息", res);
          if (res.data.code === "0") {
            this.tableData = res.data.data;
            console.log("tableData:", this.tableData);
          } else {
            throw new Error("获取数据失败");
          }
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },

    // 编辑弹窗
    handleEdit(index, row) {
      console.log(row);
      this.selectTable = row;
      this.dialogFormVisible = true;
    },

    // 添加婚礼
    addFood(index, row) {
      this.$router.push({
        path: "addWeddingInfo",
        query: { restaurant_id: row.id },
      });
    },

    // 删除婚礼
    async handleDelete(index, row) {
      try {
        await this.$axios.get(`/delHlinfo?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "删除婚礼成功",
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
        console.log("删除婚礼失败");
      }
    },

    handleServiceAvatarScucess(res, file) {
      if (res.code === "0") {
        this.formData.image_path = res.path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    },

    // 确认修改
    async updateWedding() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable);

        await this.$axios
          .post(
            `/upHlinfo?id=${this.selectTable.id}&imgpath=${this.selectTable.imgpath}&infotext=${this.selectTable.infotext}&price=${this.selectTable.price}&titletext=${this.selectTable.titletext}&hlclass=${this.selectTable.hlclass}`
          )
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "婚礼信息更新成功",
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
      } catch (err) {
        console.log("婚礼信息更新失败", err);
      }
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
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
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
