import { createApp } from 'vue';
import App from './App.vue';
import clickOutside from './directives/click-outside';
import router from './router';

const app = createApp(App);

// add directives
app.directive('click-outside', clickOutside);

app.use(router).mount('#app');