import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import ApiPlugin from './plugins/api';
import '../src/assets/styles/global.scss';

Vue.use(ApiPlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
