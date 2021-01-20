import Vue from 'vue'
import App from './App.vue'
import { applyPolyfills, defineCustomElements } from 'throughput-widget/loader';

Vue.config.productionTip = false

Vue.config.ignoredElements = ['throughput-widget']

applyPolyfills().then(() => {
  defineCustomElements();
});

new Vue({
  render: h => h(App),
}).$mount('#app')
