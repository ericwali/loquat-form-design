<template>
  <div>
    <el-form-item label="字段标识">
      <el-input v-model="column.prop" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'label']" label="标题">
      <el-input v-model="column.label" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[customizeStyle, 'width']" label="组件宽度" >
      <el-input v-model="customizeStyle.width" placeholder="请输入组件宽度" clearable/>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'labelWidth']" label="标签宽度">
      <el-input v-model.number="column.labelWidth" type="number" placeholder="请输入标签宽度" />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[plugin, 'placeholder']" label="占位内容">
      <el-input v-model="plugin.placeholder"
                clearable
                placeholder="占位内容"
      />
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, everyPermission.options, 2]" label="选项">
      <el-radio-group v-model="column.remote"
                      size="mini"
                      style="margin-bottom: 10px;"
                      @change="plugin.multiple ? $set(plugin, 'value', []) : $set(plugin, 'value', '')"
      >
        <el-radio-button :label="false">静态数据</el-radio-button>
        <el-radio-button :label="true">动态数据</el-radio-button>
      </el-radio-group>
      <template v-if="!column.remote">
        <el-checkbox v-model="plugin.showLabel">是否显示标签</el-checkbox>
        <el-checkbox-group v-if="plugin.multiple" v-model="plugin.value" size="mini">
          <draggable tag="ul"
                     :list="column.dicData"
                     :group="{ name: 'selectDicData' }"
                     ghost-class="ghost"
                     handle=".drag-item"
          >
            <li v-for="(item, index) in column.dicData" :key="index">
              <el-checkbox :label="item.value" style="margin-right: 3px;">
                <el-input v-model="item.value"
                          :style="{ width: plugin.showLabel ? '90px' : '180px'}"
                          size="mini"
                          clearable
                />
                <el-input v-if="plugin.showLabel"
                          v-model="item.label"
                          style="width: 90px;"
                          size="mini"
                          clearable
                />
              </el-checkbox>
              <i class="drag-item el-icon-s-operation"
                 style="font-size: 16px; margin: 0 5px; cursor: move;"
              />
              <el-button circle
                         plain
                         type="danger"
                         size="mini"
                         icon="el-icon-minus"
                         style="padding: 4px;margin-left: 5px;"
                         @click="handleRemoveFields(index)"
              />
            </li>
          </draggable>
        </el-checkbox-group>
        <el-radio-group v-else v-model="plugin.value" size="mini">
          <draggable tag="ul"
                     :list="column.dicData"
                     :group="{ name: 'selectDicData' }"
                     ghost-class="ghost"
                     handle=".drag-item"
          >
            <li v-for="(item, index) in column.dicData" :key="index">
              <el-radio :label="item.value" style="margin-right: 3px;">
                <el-input v-model="item.value"
                          :style="{ width: plugin.showLabel ? '90px' : '180px' }"
                          size="mini"
                          clearable
                />
                <el-input v-if="plugin.showLabel"
                          v-model="item.label"
                          style="width: 90px"
                          size="mini"
                          clearable
                />
              </el-radio>
              <i class="drag-item el-icon-s-operation"
                 style="font-size: 16px; margin: 0 5px; cursor: move;"
              />
              <el-button circle
                         plain
                         type="danger"
                         size="mini"
                         icon="el-icon-minus"
                         style="padding: 4px;margin-left: 5px;"
                         @click="handleRemoveFields(index)"
              />
            </li>
          </draggable>
        </el-radio-group>
        <div style="margin-left: 22px;">
          <el-button type="text"
                     @click="handleAddFields"
          >添加选项</el-button>
          <el-button type="text"
                     @click="plugin.multiple ? $set(plugin, 'value', []) : $set(plugin, 'value', '')"
          >重置选择</el-button>
        </div>
      </template>
      <div v-if="column.remote">
        <el-radio-group v-model="column.remoteType">
          <el-radio label="datasource">数据源</el-radio>
          <el-radio label="option">赋值变量</el-radio>
          <el-radio label="func">方法函数</el-radio>
        </el-radio-group>
        <template v-if="column.remoteType === 'datasource'">
          <el-select v-model="column.remoteDataSource"
                     size="mini"
                     style="width: 100%; margin-bottom: 5px;"
                     placeholder="请选择"
          >
            <el-option v-for="item in design.widgetForm.dataSource"
                       :key="item.key"
                       :label="item.name"
                       :value="item.key"
            />
          </el-select>
        </template>
        <template v-if="column.remoteType === 'option'">
          <el-input v-model="column.remoteOption"
                    size="mini"
                    style="margin-bottom: 5px;"
                    clearable
          />
        </template>
        <template v-if="column.remoteType === 'func'">
          <el-input v-model="column.remoteFunc"
                    size="mini"
                    style="margin-bottom: 5px;"
                    clearable
          />
        </template>
        <el-input v-model="props.value" size="mini" clearable>
          <template #prepend>值</template>
        </el-input>
        <el-input v-model="props.label" size="mini" clearable>
          <template #prepend>标签</template>
        </el-input>
      </div>
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
    <el-form-item v-loquat-has-perm="[column, someAndEveryPermission.operate, 3]" label="操作属性">
      <el-row>
        <el-col v-loquat-has-perm="[column, everyPermission.operateMultiple, 2]" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.multiple"
                       @change="(mark) => {
                         mark ? $set(plugin, 'value', []) : $set(plugin, 'value', '')
                         $set(plugin, 'drag', false)
                       }"
          >是否多选</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'filterable']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.filterable">是否可搜索</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hide']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hide">隐藏</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'disabled']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.disabled">禁用</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[column, 'hideLabel']" :span="operationComputedSpan">
          <el-checkbox v-model="column.hideLabel">隐藏标签</el-checkbox>
        </el-col>
        <el-col v-loquat-has-perm="[plugin, 'clearable']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.clearable">显示清除按钮</el-checkbox>
        </el-col>
        <el-col v-if="plugin.multiple" v-loquat-has-perm="[plugin, 'drag']" :span="operationComputedSpan">
          <el-checkbox v-model="plugin.drag">是否可拖拽</el-checkbox>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[validateConfig, 'required']" label="校验">
      <div class="validate-block">
        <el-checkbox v-model="validateConfig.required">必填</el-checkbox>
        <el-input v-show="validateConfig.required"
                  v-model.lazy="validateConfig.requiredMessage"
                  size="mini"
                  class="message-input"
                  placeholder="自定义错误提示"
        />
      </div>
    </el-form-item>
    <el-form-item v-loquat-has-perm="[column, 'events']" label="动作设置">
      <div class="event-panel-config">
        <el-collapse v-if="!validateNull(events)" :value="Object.keys(events)">
          <el-collapse-item v-for="(val,key,index) in events"
                            :key="index"
                            :title="`${key} ${get(eventsDic, key, '')}`"
                            :name="key"
          >
            <div class="event-panel-item">
              <el-select v-model="column.events[key]"
                         size="mini"
                         style="width: 100%; margin-bottom: 5px;"
              >
                <el-option v-for="item in design.widgetForm.eventScript"
                           :key="item.key"
                           :label="item.name"
                           :value="item.name"
                />
              </el-select>
              <i title="编辑代码" class="iconfont icon-code-generation" @click.stop="design.handleActionSettingsSetData({ eventName: key, funcName: val })"/>
              <i title="删除" class="iconfont icon-trash" @click.stop="column.events[key] = ''"/>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dropdown style="width: 100%; margin-top: 5px;"
                     placement="bottom"
                     trigger="click"
        >
          <el-button size="mini"
                     type="primary"
                     plain
                     style="width: 100%;"
          >新增动作<i class="el-icon-plus"/>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 280px;">
            <el-dropdown-item v-for="(val,key,index) in column.events"
                              :key="index"
                              :disabled="!!val"
                              @click.native="() => {
                                design.handleActionSettingsSetData({ eventName: key })
                                design.handleActionAdd()
                              }"
            >{{ `${key} ${get(eventsDic, key, '')}` }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import GlobalConfig from '@/global/config'
import { originComponentName, validateNull, get, deepClone } from '@utils'
import permission from '@/config/perm'
export default {
  name: 'Select',
  components: { Draggable },
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
      eventsDic: GlobalConfig.eventsDic,
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
    everyPermission () {
      return this.permConfig.everyPermission || {}
    },
    someAndEveryPermission () {
      return this.permConfig.someAndEveryPermission || {}
    },
    column () {
      return this.first ? this.data : {}
    },
    plugin () {
      return this.column.plugin || {}
    },
    props () {
      return this.plugin.props || {}
    },
    customizeStyle () {
      return this.plugin.customizeStyle || {}
    },
    validateConfig () {
      return this.column.validateConfig || {}
    },
    events () {
      const clone = deepClone(this.column.events)
      for (const val in clone) validateNull(clone[val]) && delete clone[val]
      return clone
    }
  },
  mounted () {
    this.first = true
  },
  methods: {
    get,
    validateNull,
    handleRemoveFields (index) {
      this.plugin.multiple ? this.$set(this.plugin, 'value', []) : this.$set(this.plugin, 'value', '')
      this.column.dicData.splice(index, 1)
    },
    handleAddFields () {
      this.plugin.showLabel
        ? this.column.dicData.push({ label: '新选项', value: '新选项' })
        : this.column.dicData.push(Object({ value: '新选项' }))
    }
  }
}
</script>
