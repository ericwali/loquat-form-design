<template>
  <div class="widget-config">
    <el-form label-position="top" size="small">
      <el-form-item v-loquat-has-perm="[widgetForm, 'labelPosition']" label="标签对齐方式">
        <el-radio-group v-model="widgetForm.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'labelWidth']" label="标签宽度">
        <el-input-number v-model="widgetForm.labelWidth"
                         :min="80"
                         :max="200"
                         :step="10"
                         style="width: 130px;"
        />
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'size']" label="组件尺寸">
        <el-radio-group v-model="widgetForm.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'styleSheets']" label="表单样式表">
        <el-button style="width: 100%;"
                   @click="design.styleSheetsVisible = true"
        >设置</el-button>
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'customClass']" label="自定义Class">
        <el-select v-model="widgetForm.customClass"
                   style="width: 100%;"
                   filterable
                   allow-create
                   default-first-option
                   multiple
                   laceholder="请选择"
        >
          <el-option v-for="item in design.styleSheetsArray"
                     :key="item"
                     :label="item"
                     :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'dataSource']" label="数据源">
        <el-button style="width: 100%;"
                   @click="design.dataSourceSettingsVisible = true"
        >设置</el-button>
      </el-form-item>
      <el-form-item v-loquat-has-perm="[widgetForm, 'eventScript']" label="动作面板">
        <el-button style="width: 100%;"
                   @click="design.handleActionSettingsSetData({eventName: ''})"
        >设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FormConfig',
  inject: ['designProvide'],
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      first: false
    }
  },
  computed: {
    widgetForm () {
      return this.first ? this.data : {}
    },
    design () {
      return this.designProvide || {}
    }
  },
  mounted () {
    this.first = true
  }
}
</script>
