<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'label']" label="标题">
      <el-input v-model="column.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="column.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, everyPermission.theme, 2]" label="主题">
      <el-switch v-model="plugin.effect"
                 :disabled="plugin.effectType === 'default'"
                 active-value="dark"
                 inactive-value="light"
                 active-text="黑暗"
                 inactive-text="明亮"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'effectType']" label="主题类型">
      <el-select v-model="plugin.effectType"
                 style="width: 100%;"
      >
        <el-option value="default"/>
        <el-option value="success"/>
        <el-option value="info"/>
        <el-option value="warning"/>
        <el-option value="error"/>
        <el-option value="tip"/>
      </el-select>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'value']" label="默认值">
      <el-input v-model="plugin.value"
                type="textarea"
                :rows="5"
                clearable
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'customClass']" label="自定义Class">
      <el-select v-model="column.customClass"
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
    <el-form-item v-loquat-has-perm="[column, somePermission.operate, 1]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'center']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.center">文字居中</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import { originComponentName } from '@utils'
import permission from '@/config/perm'
export default {
  name: 'Font',
  inject: ['designProvide'],
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      permission,
      first: false,
      operationComputedSpan: 24 / 2
    }
  },
  computed: {
    design () {
      return this.designProvide || {}
    },
    permConfig () {
      const name = originComponentName(this.$options.name)
      return this.permission.find(item => name === item.component) || {}
    },
    somePermission () {
      return this.permConfig.somePermission || {}
    },
    everyPermission () {
      return this.permConfig.everyPermission || {}
    },
    column () {
      return this.first ? this.data : {}
    },
    plugin () {
      return this.column.plugin || {}
    }
  },
  mounted () {
    this.first = true
  }
}
</script>
