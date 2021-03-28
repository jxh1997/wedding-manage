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
          <el-form-item label="婚礼名称" prop="title">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="婚礼简介" prop="desc">
            <el-input v-model="formData.desc"></el-input>
          </el-form-item>
          <el-form-item label="婚礼详情" prop="desc2">
            <el-input type="textarea" v-model="formData.desc2"></el-input>
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
            <el-input v-model="formData.price1" style="width: 100px"></el-input>
            <!-- ~ -->
            <!-- <el-input v-model="formData.price2" style="width: 100px"></el-input> -->
          </el-form-item>

          <el-form-item label="上传婚礼图片">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl"
              :show-file-list="false"
              :on-success="handleShopAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.image_path"
                :src="formData.image_path"
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
        title: "", //婚礼名称
        desc: "", //婚礼简介
        desc2: "", //婚礼详情
        price1: 0, //价格1
        price2: 0, //价格2
        image_path: "",
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
        this.formData.image_path = res.path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    // 限制上传图片格式、大小
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

    // 立即创建表单提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          Object.assign(this.formData);
          try {
            await this.$axios
              .post(
                `/insHlinfo?hlclass=${this.formData.activityValue}&imgpath=${this.formData.image_path}&infotext=${this.formData.desc2}&price=${this.formData.price1}&titletext=${this.formData.title}`
              )
              .then((res) => {
                console.log(res);
                if (res.data.code === "0") {
                  this.$message({
                    type: "success",
                    message: "添加成功",
                  });
                  this.formData = {
                    title: "", //婚礼名称
                    desc: "", //婚礼简介
                    desc2: "", //婚礼详情
                    price1: 0, //价格1
                    price2: 0, //价格2
                    activityValue: "西式婚礼",
                    image_path: "",
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
