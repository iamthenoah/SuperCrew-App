import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'No Game',
		component: () => import('../views/GameNotOpened.vue')
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import('../views/Home.vue'),
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
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;