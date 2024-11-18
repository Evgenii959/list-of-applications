import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';

Vue.use(Router);

const routes = [
  {
    path: '/list-of-applications/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/list-of-applications/login',
    name: 'LoginPage',
    component: LoginPage,
  },
];

const router = new Router({
  mode: 'history',
  routes,
});

export default router;
