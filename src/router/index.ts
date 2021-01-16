import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../views/Home.vue')
	},
	{
		path: '/playing',
		name: 'Playing',
		component: () => import('../views/Playing.vue'),
	},
	{
		path: '/preferences',
		name: 'Preferences',
		component: () => import('../views/Preferences.vue')
	},
	{
		path: '/information',
		name: 'Information',
		component: () => import('../views/Information.vue')
	},
	{
		path: '/voice',
		name: 'Voice',
		component: () => import('../views/Voice.vue')
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;