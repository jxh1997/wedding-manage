<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="婚礼名称" prop="titletext">
            <el-input v-model="formData.titletext"></el-input>
          </el-form-item>
          <el-form-item label="婚礼简介" prop="infotext">
            <el-input v-model="formData.infotext"></el-input>
          </el-form-item>
          <el-form-item label="婚礼详情" prop="xqtext">
            <el-input type="textarea" v-model="formData.xqtext"></el-input>
          </el-form-item>
          <el-form-item label="婚礼类型">
            <el-select
              v-model="formData.activityValue"
              :placeholder="formData.activityValue"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="婚礼价格" style="white-space: nowrap">
            <el-input v-model="formData.price" style="width: 100px"></el-input>
            <!-- ~ -->
            <!-- <el-input v-model="formData.price2" style="width: 100px"></el-input> -->
          </el-form-item>

          <el-form-item label="上传婚礼图片">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl"
              :show-file-list="false"
              :on-success="handleShopAvatarScucess"
            >
              <img
                v-if="formData.imgpath"
                :src="$store.state.baseUrl2 + formData.imgpath"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')"
              >立即创建</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";

export default {
  data() {
    return {
      formData: {
        titletext: "", //婚礼名称
        hlclass: "", // 婚礼类型
        infotext: "", //婚礼简介
        xqtext: "", //婚礼详情
        price: 0, //价格1
        imgpath: "",
        activityValue: "西式婚礼",
      },
      rules: {
        title: [{ required: true, message: "请输入婚礼名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入婚礼简介", trigger: "blur" }],
        price1: [{ required: true, message: "请输入婚礼价格" }],
        price2: [{ required: true, message: "请输入婚礼价格" }],
      },
      options: [
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

      baseUrl: "/test/uploadfile",
      categoryOptions: [],
    };
  },

  components: {
    headTop,
  },

  methods: {
    // 上传图片
    handleShopAvatarScucess(res, file) {
      console.log("handleShopAvatarScucess: ", res);
      if (res.code === "0") {
        this.formData.imgpath = res.path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    // 立即创建表单提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          Object.assign(this.formData);
          try {
            await this.$axios
              .post(
                `/insHlinfo?hlclass=${this.formData.activityValue}&imgpath=${this.formData.imgpath}&infotext=${this.formData.infotext}&price=${this.formData.price}&titletext=${this.formData.titletext}&xqtext=${this.formData.xqtext}`
              )
              .then((res) => {
                if (res.data.code === "0") {
                  this.$message({
                    type: "success",
                    message: "添加成功",
                  });
                  this.formData = {
                    titletext: "", //婚礼名称
                    hlclass: "", // 婚礼类型
                    infotext: "", //婚礼简介
                    xqtext: "", //婚礼详情
                    price: 0, //价格1
                    imgpath: "",
                    activityValue: "西式婚礼",
                  };
                  this.$router.push({
                    path: "weddingInfoList",
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg,
                  });
                }
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
  text-align: center;
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
