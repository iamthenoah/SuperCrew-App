import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import VueClickOutside from './directives/click-outside';
import VueTooltip from './directives/tooltip';
// import tooltip from './directives/tooltip';

const app = createApp(App);

// add directives
app.directive('click-outside', VueClickOutside);
app.directive('tooltip', VueTooltip);

app.use(router).mount('#app');