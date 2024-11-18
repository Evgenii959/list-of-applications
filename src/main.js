import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import '../src/assets/styles/global.scss';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
