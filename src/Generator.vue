<template>
  <div class="hello">
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <el-button class="ope-btn" type="primary" round
        @click="addSource">
        添加数据源
      </el-button>
      <div v-if="sources.length">
        <template v-for="(source, idx) in sources">
          <el-form-item :label="`数据源 ${idx + 1}:`" :key="`source-${idx}`">
            <el-row>
              <el-col :span="steps.length ? 18 : 21">
                <el-input v-model="sources[idx]" @input="getSourceTip(idx)"></el-input>
              </el-col>
              <el-col :span="3" :offset="1" v-if="steps.length">
                <span>可重复性：</span>
                <el-switch v-model="sourceDupFlags[idx]"
                  active-color="#13ce66">
                </el-switch>
              </el-col>
              <el-col :span="1" :offset="1">
                <el-button type="danger" icon="el-icon-delete" circle
                  @click="delSource"></el-button>
              </el-col>
            </el-row>
            <div class="tips">
              {{ sourcesTip[idx] || '内容为空，请输入内容' }}
            </div>
          </el-form-item>
        </template>
        <el-divider></el-divider>

        <el-button  class="ope-btn" type="primary" round
          @click="addStep()">
          添加步骤
        </el-button>
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
              <el-col :span="1" :offset="1">
                <el-button type="danger" icon="el-icon-delete" circle
                  @click="steps.splice(idx, 1);"></el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-divider></el-divider>

        <el-button  class="ope-btn" type="primary" round
          @click="processorFlag = !processorFlag">
          编辑处理函数
        </el-button>
        <template v-if="processorFlag">
          <el-input
            type="textarea" :rows="5"
            v-model="processor"></el-input>
        </template>
        <el-divider></el-divider>

        <el-form-item>
          <el-button type="primary" @click="onArrangement">开始排列</el-button>
          <el-button @click="onReset">还原</el-button>
          <el-button @click="onClear">清空结果</el-button>
        </el-form-item>

        <div v-if="result.length">
          <el-divider></el-divider>
          <span>共计{{ result.length }}个</span>
          <ul class="result-list">
            <li
              v-for="i in result"
              :key="i"
              class="result-item">{{ i }}</li>
          </ul>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sources: [],
      sourcesTip: [],
      sourceDupFlags: [],
      steps: [],
      form: {},
      result: [],
      processorFlag: false,
      processor: 'args => args.join("")',
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
      let result = [[]];
      this.steps.forEach((s) => {
        const arr = [];
        result.forEach((p) => {
          data[s].forEach((c) => {
            if (!this.sourceDupFlags[s] && p.includes(c)) {
              return;
            }
            const temp = [];
            temp.push(c);
            arr.push(p.concat(temp));
          });
        });
        result = arr;
      });
      /* eslint-disable no-eval */
      result = result.map(eval(this.processor));
      /* eslint-enable no-eval */
      return result;
    },
    addSource() {
      this.sources.push('');
      this.sourcesTip.push('');
      this.sourceDupFlags.push(true);
    },
    delSource(idx) {
      this.sources.splice(idx, 1);
      this.sourcesTip.splice(idx, 1);
      this.sourceDupFlags.splice(idx, 1);
    },
    addStep() {
      const last = Math.min(this.steps.length, this.sources.length - 1);
      this.steps.push(last);
    },
    getSourceSep(str) {
      const defaultSep = {
        label: '任意字符',
        value: '',
      };
      const arr = [
        {
          label: '英文逗号',
          value: ',',
        },
        {
          label: '中文逗号',
          value: '，',
        },
        {
          label: '空格',
          value: ' ',
        },
      ];
      const sep = arr.find((item) => str.includes(item.value));
      return sep || defaultSep;
    },
    getSourceTip(idx) {
      const str = this.sources[idx];
      if (!str) {
        this.sourcesTip[idx] = '';
        return;
      }

      const sep = this.getSourceSep(str);
      this.sourcesTip[idx] = `分隔符是"${sep.label}"`;
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
      this.processor = 'args => args.join("")';
      this.processorFlag = false;
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

  .ope-btn {
    margin-bottom: 20px;
  }

  .tips {
    background-color: #f4f4f5;
    color: #909399;
    margin-top: 3px;
    line-height: 20px;
    padding: 5px;
  }

  .result-list {
    max-height: 200px;
    overflow-y: scroll;
    border: 1px solid gray;
  }

  .result-item {
    font-family: 'courier new', typewriter, matrix, monospace;
  }

  .result-item:nth-child(even) {
    background: #eee;
  }
</style>
