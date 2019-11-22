
<template>
  <page-view class="x-page-customer" v-if="customer" :title="title">
    <a-row slot="headerContent" class="x-header">
      <div class="x-header-avatar">
        <img :src="customer.user.avatar" />
      </div>
      <div class="x-header-userInfo">
        <description-list title="">
          <description-item term="姓名">{{ customer.user.name }}</description-item>
          <description-item term="昵称">未知</description-item>
          <description-item term="成为客户">2019-11-21</description-item>
          <description-item term="备注">无</description-item>
        </description-list>
      </div>
      <div class="x-header-extra">
        <description-list title="">
          <description-item term="最近浏览">2019-11-21 20:22:33</description-item>
          <description-item term="手机号">13811223344</description-item>
          <description-item term="最近收货地址">xxx yyy zzz abcdefg</description-item>
        </description-list>
      </div>
    </a-row>

    <a-card :bordered="false" title="客户资料">
      <description-list title="">
        <description-item term="收货人">1</description-item>
        <description-item term="联系电话">2</description-item>
        <description-item term="收货地址">3</description-item>
      </description-list>
    </a-card>

    <!-- <order-operation-forms ref="operateOrderForms" @change="onFinishOperateOrder"/> -->

  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import DescriptionList from '@/components/DescriptionList'
import { CustomerService } from '@/api/service'
import { formatPrice } from '@/utils/util'

const DescriptionItem = DescriptionList.Item

export default {
  name: 'CrmCustomer',
  components: {
    PageView,
    DescriptionList,
    DescriptionItem
  },
  mixins: [],
  data () {
    const id = this.$route.query.user_id || ''
    return {
      id: id,
      customer: null
    }
  },

  computed: {
    title () {
      return '基本信息'
    }
  },

  async mounted () {
    this.customer = await CustomerService.getCustomer(this.id)
  },

  methods: {
    formatMoney (money) {
      return formatPrice(money)
    }
  }
}
</script>

<style lang="less">
.x-page-customer {
  .x-header {
    display: flex;
    flex-direction: row;
    &-avatar {
      width: 150px;
    }

    &-userInfo {
      width: 250px;
    }

    &-extra {
      flex: 1;
    }

    .description-list {
      width: 300px;
      .ant-row {
        display: flex;
        flex-direction: column;

        .term, .content {
          padding-bottom: 3px;
        }

        .ant-col-md-8, .ant-col-sm-12, .ant-col-xs-24 {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
