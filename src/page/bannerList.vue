<template>
  <div class="fillcontain">
    <head-top></head-top>

    <div class="table_container">
      <el-button type="success" @click="dialogFormVisible = true">
        添加图片
      </el-button>
      <el-tooltip placement="top">
        <div slot="content">若排序数字相同，则按顺序显示。</div>
        <el-button>排序声明</el-button>
      </el-tooltip>
            
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="轮播图排序" prop="pxnum" width="150">
        </el-table-column>
        <el-table-column
          label="轮播图类型"
          prop="bclass"
          width="200"
        ></el-table-column>
        <el-table-column label="图片预览" width="350">
          <template slot-scope="scope">
            <img
              :src="$store.state.baseUrl2 + scope.row.imgpath"
              alt=""
              class="bannerImg"
            />
          </template>
        </el-table-column>
        <el-table-column label="图片地址" prop="imgpath"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handlePx(scope.$index, scope.row)">
              排序
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

      <!-- 新增banner弹窗 -->
      <el-dialog
        title="新增图片"
        v-model="dialogFormVisible"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="tableData">
          <el-form-item label="轮播图类型" label-width="100px">
            <el-select
              v-model="bannerInfo.bclass"
              :placeholder="bannerInfo.bclassOptions[0].value"
            >
              <el-option
                v-for="item in bannerInfo.bclassOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序数" label-width="100px">
            <el-input v-model="bannerInfo.pxnum"></el-input>
          </el-form-item>
          <el-form-item label="图片上传" label-width="100px">
            <el-upload
              class="upload-demo"
              :action="baseUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleBannerSuccess"
              :on-error="handleBannerError"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 排序弹窗 -->
      <el-dialog
        title="轮播图排序"
        v-model="dialogFormVisible2"
        :visible.sync="dialogFormVisible2"
      >
        <el-form :model="selectTable2">
          <el-form-item label="轮播图类型" label-width="100px">
            <el-input v-model="selectTable2.bclass" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="排序数" label-width="100px">
            <el-input v-model="selectTable2.pxnum"></el-input>
          </el-form-item>
          <el-form-item label="轮播图预览" label-width="100px">
            <img
              :src="$store.state.baseUrl2 + selectTable2.imgpath"
              class="yulanImg"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdate">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
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
  components: {
    headTop,
  },
  data() {
    return {
      baseUrl: "/test/uploadfile",
      fileList: [],
      tableData: [],
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
      currentRow: null,
      expendRow: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      selectTable2: [],

      bannerInfo: {
        bclassOptions: [
          {
            value: "首页轮播图",
            label: "首页轮播图",
          },
        ],
        bclass: "首页轮播图",
        pxnum: 1,
        imgpath: "",
      },
    };
  },
  created() {
    this.initData();
  },

  methods: {
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getOrders();
    },
    // 初始化数据
    async initData() {
      try {
        await this.$axios.get(`/getBannerInfoList`).then((res) => {
          if (res.data.code === "0") {
            this.count = res.data.count;
            this.tableData = res.data.data;
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

    // 上传图片
    async handleAdd() {
      console.log(this.bannerInfo);
      try {
        await this.$axios
          .get(
            `/insBannerinfo?bclass=${this.bannerInfo.bclass}&imgpath=${this.bannerInfo.imgpath}&pxnum=${this.bannerInfo.pxnum}`
          )
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "轮播图上传成功",
              });
              this.dialogFormVisible = false;
              this.bannerInfo.pxnum ++;
              this.fileList = [];
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
        console.log("轮播图上传失败");
      }
    },

    // 修改排序
    async handlePx(index, row) {
      this.dialogFormVisible2 = true;
      this.selectTable2 = row;
    },

    // 轮播图排序确认修改
    handleUpdate() {
      try {
        this.$axios
          .get(
            `/upBannerinfo?id=${this.selectTable2.id}&pxnum=${this.selectTable2.pxnum}`
          )
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "轮播图排序修改成功",
              });
              this.dialogFormVisible2 = false;
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
        console.log("轮播图排序修改失败");
      }
    },

    // 图片上传成功
    handleBannerSuccess(res) {
      this.bannerInfo.imgpath = res.path;

    },
    // 图片上传失败
    handleBannerError() {
      this.$message({
        message: '图片上传失败',
        type: 'warning'
      })
    },

    // 删除轮播图
    async handleDelete(index, row) {
      try {
        await this.$axios.get(`/delBanner?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "轮播图删除成功",
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
        console.log("轮播图删除失败");
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>

<style>
.bannerImg {
  width: 300px;
  height: 200px;
}
.yulanImg {
  height: 200px;
  width: 300px;
}
</style>