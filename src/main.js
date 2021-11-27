import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(VueVirtualScroller)

new Vue({
  render: h => h(App)
}).$mount('#app');
