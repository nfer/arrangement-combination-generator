<template>
  <div id="app">
    <h1>排列组合生成器</h1>
    <Generator />
  </div>
</template>

<script>
import Generator from './Generator.vue';

export default {
  name: 'app',
  components: {
    Generator,
  },
};
</script>

<style lang="less">
#app {
  max-width: 1024px;
  margin: 0 auto;
}

h1 {
  text-align: center;
}
</style>
