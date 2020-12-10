import Vue from 'vue';
import ElementUI from 'element-ui';
import GitVersion from 'show-git-version';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

GitVersion.trace();

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
