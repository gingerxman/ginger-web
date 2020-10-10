<template>
  <page-view :title="title" class="x-page-pointRule">
    <a-card :bordered="false" style="min-height:65vh;">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            label="奖励分值"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              :min="0"
              :step="1"
              v-decorator="[
                'point',
                {rules: [{required: true, message: '请输入奖励分值！'}]}
              ]"
            />
          </a-form-item>

          <a-form-item
            label="领取设置"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol">
            <a-radio-group
              v-decorator="[
                'type',
              ]"
              button-style="solid"
              @change="onChangeType"
            >
              <a-radio value="weixin" :style="radioStyle" :disabled="true">
                关注微信公众号
              </a-radio>
              <a-radio value="trade" :style="radioStyle">
                每成功交易
                <a-input-number
                  :min="0"
                  :step="1"
                  style="margin-left:5px;"
                  v-decorator="[
                    'trade_count'
                  ]"
                />
                笔
              </a-radio>
              <a-radio value="money" :style="radioStyle">
                每购买金额
                <a-input-number
                  :min="0"
                  :step="0.1"
                  style="margin-left:5px;"
                  v-decorator="[
                    'money_count'
                  ]"
                />
                元
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
    <div class="x-fixed-actions">
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </div>
  </page-view>
</template>

<script>
import moment from 'moment'
import { PageView } from '@/layouts'
import { PointService, SystemService } from '@/api/service'

export default {
  name: 'PointRule',

  components: {
    PageView
  },

  data () {
    return {
      labelCol: { lg: { span: 2 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      radioStyle: {
        display: 'block',
        height: '50px',
        lineHeight: '50px',
      },

      confirmLoading: false,
      title: '编辑积分规则',
      rule: null,
      form: this.$form.createForm(this)
    }
  },

  filters: {
  },

  created () {
  },

  mounted () {
    const ruleId = this.$route.query.id || -1
    if (ruleId === -1) {
      this.title = '新建积分规则'
    }
    setTimeout(async () => {
      await this.loadRule(ruleId)
    })
  },

  methods: {
    async loadRule (ruleId) {
      if (ruleId === -1 && SystemService.inDevEnv()) {
        // this.loadDefaultData()
      } else {
          this.rule = await PointService.getPointRule(ruleId)
          console.log(this.rule)
          this.form.setFieldsValue({
            point: this.rule.point,
            type: this.rule.type,
            trade_count: this.rule.type === 'trade' ? this.rule.data.count : '',
            money_count: this.rule.type === 'money' ? (this.rule.data.count/100).toFixed(2) : ''
          })
      }
    },

    onChangeType (e) {
      this.form.setFieldsValue({
        trade_count: '',
        money_count: ''
      })
    },

    async handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields(async (errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (!values.type) {
            this.$message.error('请选择领取设置')
            this.confirmLoading = false
            return
          }

          if (values.type == 'trade' && !values.trade_count) {
            this.$message.error('请设置交易笔数')
            this.confirmLoading = false
            return
          }

          if (values.type == 'money' && !values.money_count) {
            this.$message.error('请设置金额数')
            this.confirmLoading = false
            return
          }

          const data = {}
          if (values.type == 'trade') {
            data['count'] = values.trade_count
          } else if (values.type == 'money') {
            data['count'] = Math.round(values.money_count * 100)
          }
          console.log(values)
          try {
            console.log(this.rule)
            if (this.rule === null) {
              await PointService.createPointRule(values.type, data, values.point)
              this.$message.success('创建成功，返回列表页')
            } else {
              await PointService.updatePointRule(this.rule.id, values.type, data, values.point)
              this.$message.success('更新成功，返回列表页')
            }
            setTimeout(() => {
              this.$router.back(-1)
            }, 1500)
          } catch(e) {
            this.$message.error('创建规则失败!')
          }
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .x-page-pointRule {
    .x-fixed-actions {
      padding:20px;
      width:78vw;
      min-width: 750px;
      display: flex;
      justify-content: center;
      align-items: center;
      position:fixed;
      bottom:0px;
      background-color:#FFF;
      box-shadow: 0 -3px 5px #eee;
      z-index:100;
      transition: right .2s ease;
    }
  }
</style>
