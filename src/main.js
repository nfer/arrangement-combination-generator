import Vue from 'vue';
import ElementPlus from 'element-plus';
import GitVersion from 'show-git-version';
import 'element-plus/dist/index.css';
import App from './App.vue';

GitVersion.trace();

Vue.use(ElementPlus);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
