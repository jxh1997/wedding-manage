<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
						<el-menu-item index="userList"><i class="el-icon-user"></i>用户管理</el-menu-item>
						<el-menu-item index="weddingInfoList"><i class="el-icon-link"></i>婚礼信息管理</el-menu-item>
						<el-menu-item index="addWeddingInfo"><i class="el-icon-folder-add"></i>添加婚礼</el-menu-item>
						<el-menu-item index="commentList"><i class="el-icon-chat-line-round"></i>评论管理</el-menu-item>
						<el-menu-item index="orderList"><i class="el-icon-document"></i>用户预约订单管理</el-menu-item>
						<el-menu-item index="bannerList"><i class="el-icon-picture-outline"></i>轮播图管理</el-menu-item>
                        <el-menu-item index="musicList"><i class="el-icon-headset"></i>背景音乐管理</el-menu-item>
						<el-menu-item index="explain"><i class="el-icon-warning"></i>说明</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';

</style>
