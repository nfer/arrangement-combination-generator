<template>
  <div class="hello">
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <template v-for="(source, idx) in sources">
        <el-form-item :label="`数据源 ${idx + 1}:`" :key="`source-${idx}`">
          <el-row>
            <el-col :span="22">
              <el-input v-model="sources[idx]"></el-input>
            </el-col>
            <el-col :span="1" :offset="1" v-if="sources.length > 1">
              <el-button type="danger" icon="el-icon-delete" circle
                @click="sources.splice(idx, 1)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <el-button type="primary" round @click="sources.push('')">添加数据源</el-button>
      <el-divider></el-divider>

      <template v-for="(step, idx) in steps">
        <el-form-item :label="`数据源 ${idx + 1}:`" :key="`step-${idx}`">
          <el-row>
            <el-col :span="22">
              <el-select v-model="steps[idx]" placeholder="请选择数据源">
                <template v-for="(source, sourceIdx) in sources">
                  <el-option :label="`数据源 ${sourceIdx + 1}`"
                    :key="`step-source-${sourceIdx}`" :value="sourceIdx"></el-option>
                </template>
              </el-select>
            </el-col>
            <el-col :span="1" :offset="1" v-if="steps.length > 1">
              <el-button type="danger" icon="el-icon-delete" circle
                @click="steps.splice(idx, 1);"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <el-button type="primary" round @click="steps.push(0)">添加步骤</el-button>
      <el-divider></el-divider>

      <el-form-item>
        <el-button type="primary" @click="onArrangement">开始排列</el-button>
        <el-button @click="onReset">还原</el-button>
        <el-button @click="onClear">清空结果</el-button>
      </el-form-item>

      <div v-if="result.length">
        <el-divider></el-divider>
        <ul>
          <li
            v-for="i in result"
            :key="i"
            class="infinite-list-item">{{ i }}</li>
        </ul>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sources: [''],
      steps: [],
      form: {
      },
      result: [],
    };
  },
  methods: {
    arrangement(data) {
      const result = data.reduce((prev, curr) => {
        const arr = [];
        prev.forEach((p) => {
          curr.forEach((c) => {
            arr.push(`${p}${c}`);
          });
        });
        return arr;
      }, ['']);
      return result;
    },
    arrangementSteps(data) {
      let result = [''];
      this.steps.forEach((s) => {
        const arr = [];
        result.forEach((p) => {
          data[s].forEach((c) => {
            arr.push(`${p}${c}`);
          });
        });
        result = arr;
      });
      return result;
    },
    checkSource() {
      const data = [];
      for (let i = 0; i < this.sources.length; i += 1) {
        let element = this.sources[i];
        element = element.trim();
        element = element.replace(/\s*/g, '');
        if (element === '') {
          this.$alert(`数据源 ${i + 1} 的内容为空`);
          return [];
        }

        const arr = element.split(',');
        const set = [...new Set(arr)];
        if (set.length !== arr.length) {
          this.$alert(`数据源 ${i + 1} 的内容有重复字段`);
          return [];
        }

        data.push(arr);
      }
      return data;
    },
    onArrangement() {
      const data = this.checkSource();
      if (!data.length) {
        return;
      }

      if (this.steps.length === 0) {
        this.result = this.arrangement(data);
      } else {
        this.result = this.arrangementSteps(data);
      }
    },
    onReset() {
      this.sources = [''];
      this.steps = [];
      this.result = '';
    },
    onClear() {
      this.result = '';
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .el-select {
    display: block;
  }
</style>
