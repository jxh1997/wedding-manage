import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	baseUrl2: "http://152.136.229.70:8011/test",  // 图片地址
	adminInfo: {
		avatar: require('@/assets/img/avatar.png')
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			}else{
				throw new Error(res.type)
			}
		}catch(err){
			// console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
