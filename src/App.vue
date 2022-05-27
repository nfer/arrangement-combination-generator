<template>
  <div id="app">
    <h1>排列组合生成器</h1>
    <ArrangementCombinationGenerator />
  </div>
</template>

<script>
import ArrangementCombinationGenerator from './ArrangementCombinationGenerator.vue';

export default {
  name: 'app',
  components: {
    ArrangementCombinationGenerator,
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
