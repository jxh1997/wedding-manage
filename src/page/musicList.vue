<template>
  <div class="fillcontain">
    <head-top></head-top>

    <div class="table_container">
      
      <el-tooltip placement="top">
        <div slot="content">
          背景音乐添加方式：<br/>
          1. 在网易云音乐中打开要添加的音乐<br/>
          2. 选择“分享”，“复制链接”，用浏览器打开<br/>
          3. 点击“生成外链播放器”，选择使用插件，复制HTML代码中的src链接添加即可<br/>
        </div>
        <el-button type="success" @click="dialogFormVisible = true">
          添加背景音乐
        </el-button>
      </el-tooltip>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="ID" prop="id" width="100"> </el-table-column>
        <el-table-column label="音乐预览" width="400">
          <template slot-scope="scope">
            <iframe
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              width="330"
              height="86"
              :src="scope.row.filepath"
            ></iframe>
          </template>
        </el-table-column>
        <el-table-column label="音乐路径" prop="filepath"> </el-table-column>
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

      <!-- 新增banner弹窗 -->
      <el-dialog
        title="上传音乐"
        v-model="dialogFormVisible"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="selectTable">
          <el-form-item label="音乐路径" label-width="100px">
            <el-input
              placeholder='https://music.163.com/outchain/player?type=2&id=27899008&auto=0&height=66'
              v-model="selectTable.filepath"
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
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
      tableData: [],
      selectTable: [],
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
      currentRow: null,
      expendRow: [],
      dialogFormVisible: false,
    };
  },
  created() {
    this.initData();
  },

  methods: {
    // 初始化数据
    async initData() {
      try {
        await this.$axios.get(`/getMusicInfoList`).then((res) => {
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

    // 上传音乐
    async handleAdd() {
      let filepath = encodeURIComponent(this.selectTable.filepath);
      try {
        await this.$axios
          .get(`/insMusicinfo?filepath=${filepath}`)
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                type: "success",
                message: "音乐上传成功",
              });
              this.dialogFormVisible = false;
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
        console.log("音乐上传失败");
      }
    },

    // 删除音乐
    async handleDelete(index, row) {
      try {
        await this.$axios.get(`/delMusicinfo?id=${row.id}`).then((res) => {
          if (res.data.code === "0") {
            this.$message({
              type: "success",
              message: "音乐删除成功",
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
        console.log("音乐删除失败");
      }
    },
  },

  // 分页
  handleSizeChange(val) {
    console.log(`每页 ${val} 条`);
  },
  handleCurrentChange(val) {
    this.currentPage = val;
    this.offset = (val - 1) * this.limit;
    this.getOrders();
  },
};
</script>

<style>
</style>