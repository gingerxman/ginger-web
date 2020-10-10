<template>
  <a-card :bordered="false" class="x-page-pointRules">
    <div class="x-seperator mb15">
      <div class="x-title">设置通用积分规则</div>
    </div>

    <a-table
      ref="systemRuleTable"
      size="default"
      :rowKey="record => record.id"
      :columns="systemRuleColumns"
      :dataSource="systemRules"
      :loading="loading"
      :pagination="false"
    >
      <div slot="detail" slot-scope="text, record">
        -
      </div>

      <div slot="updated_at" slot-scope="text, record">
        {{ record.updated_at === record.created_at ? '-' : record.updated_at }}
      </div>

      <span slot="action" slot-scope="text, record">
        <a @click.stop="onClickEdit(record)">设置</a>
      </span>
    </a-table>


    <div class="x-seperator mb15 mt40">
      <div class="x-title">自定义积分规则</div>
    </div>

    <div class="mb15">
      <a-button type="primary" icon="plus" @click="onClickAddRule">新建积分规则</a-button>
    </div>

    <a-table
      ref="customRuleTable"
      size="default"
      :rowKey="record => record.id"
      :columns="customRuleColumns"
      :dataSource="customRules"
      :loading="loading"
      :pagination="false"
    >
      <div slot="name" slot-scope="text, record">
        <div v-if="record.type === 'trade'">每成功交易{{ record.data.count }}笔</div>
        <div v-if="record.type === 'money'">每购买金额{{ (record.data.count/100).toFixed(2) }}元<span class="x-product-hint">全部商品参加</span></div>
        <div v-if="record.name !== 'custom'">{{ record.name }}</div>
      </div>

      <span slot="action" slot-scope="text, record">
        <a @click.stop="onClickEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="你确定要删除该积分规则吗?" @confirm="onDeleteRule(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { PointService } from '@/api/service'
import { formatPrice } from '@/utils/util'

export default {
  name: 'PointRules',
  data () {
    return {
      systemRuleColumns: [{
        title: '规则名',
        dataIndex: 'name',
        width: '200px'
      }, {
        title: '规则详情',
        scopedSlots: { customRender: 'detail' }
      }, {
        title: '规则更新时间',
        scopedSlots: { customRender: 'updated_at' },
        width: '200px'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '140px',
        scopedSlots: { customRender: 'action' }
      }],

      customRuleColumns: [{
        title: '奖励条件',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '单笔奖励积分',
        dataIndex: 'point',
        width: '120px'
      }, {
        title: '规则更新时间',
        dataIndex: 'updated_at',
        width: '200px'
      }, {
        title: '已奖励总积分',
        dataIndex: 'total_points',
        width: '120px'
      }, {
        title: '状态',
        dataIndex: 'status',
        width: '100px'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '140px',
        scopedSlots: { customRender: 'action' }
      }],
      
      loading: false,
      systemRules: [],
      customRules: [],
    }
  },

  filters: {
  },

  created () {
  },

  async mounted () {
    await this.loadRules()
  },

  methods: {
    formatMoney (money) {
      return formatPrice(money)
    },

    async loadRules () {
      let { rules, pageinfo } = await PointService.getPointRules()
      console.log(rules)
      rules = rules.map(rule => {
        return {
          ...rule,
          total_points: 100,
          status: '生效中'
        }
      })

      this.systemRules = rules.filter(rule => {
        return rule.is_system_rule
      })
      this.customRules = rules.filter(rule => {
        return !rule.is_system_rule
      })
    },

    onClickAddRule () {
      this.$router.push({
        path: '/crm/point_rule',
        query: {
        }
      })
    },

    onClickEdit (rule) {
      this.$router.push({
        path: '/crm/point_rule',
        query: {
          id: rule.id
        }
      })
    },

    async onDeleteRule (rule) {
      try {
        await PointService.deletePointRule(rule.id)
        await this.loadRules()
      } catch(e) {
        this.$message.error('删除规则失败!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .x-page-pointRules {
    .x-seperator {
      background-color: #fafafa;
      padding: 15px;

      .x-title:before {
        content: '';
        background-color: #1890FF;
        width: 5px;
        height: 20px;
        margin-right: 10px;
        float: left;
      }

      .x-title {
        line-height: 20px;
        height: 20px;
        font-weight: bold;
        font-size: 14px;
      }
    }

    .table-operator {
      margin-bottom: 5px;
      margin-top: 20px;
    }

    .x-product-hint {
      font-size:10px;
      color:#888;
      margin-left:10px;
    }
  }
</style>
