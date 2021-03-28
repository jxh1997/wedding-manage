import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const weddingInfoList = r => require.ensure([], () => r(require('@/page/weddingInfoList')), 'weddingInfoList');
const addWeddingInfo = r => require.ensure([], () => r(require('@/page/addWeddingInfo')), 'addWeddingInfo');
const commentList = r => require.ensure([], () => r(require('@/page/commentList')), 'commentList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const bannerList = r => require.ensure([], () => r(require('@/page/bannerList')), 'bannerList');
const musicList = r => require.ensure([], () => r(require('@/page/musicList')), 'musicList');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');


const routes = [
	{
		path: '/',
		component: login,
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/userList',
			component: userList,
			meta: ['用户管理'],
		},{
			path: '/weddingInfoList',
			component: weddingInfoList,
			meta: ['婚礼信息管理'],
		},{
			path: '/addWeddingInfo',
			component: addWeddingInfo,
			meta: ['添加婚礼'],
		},{
			path: '/commentList',
			component: commentList,
			meta: ['评论管理'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['用户预约订单管理'],
		},{
			path: '/bannerList',
			component: bannerList,
			meta: ['轮播图管理'],
		},{
			path: '/musicList',
			component: musicList,
			meta: ['背景音乐管理'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
