import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import GitVersion from 'show-git-version';
import 'element-plus/dist/index.css';
import App from './App.vue';

GitVersion.trace();

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
