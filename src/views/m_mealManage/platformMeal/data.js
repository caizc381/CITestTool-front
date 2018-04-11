import { getGender, formatPrice } from './utils'

export const getColumns = (context) => [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '平台套餐名称',
    key: 'name',
    render: (h, params) => {
      return (
        <div>
          <div class="ell" title={params.row.name}>
            {!!params.row.disable  && <span class="mt-tag">停用</span>}
            {params.row.name}
          </div>
          <div class="gray">ID: {params.row.id}</div>
        </div>
      )
    }
  },
  {
    title: '性别',
    key: 'gender',
    width: 80,
    render: (h, params) => {
      return (
        <div>
        <span>{ getGender(params.row.gender)}</span>
        </div>
      )
    }
  },
  {
    title: '体检中心',
    key: 'hospitalName',
    render: (h, params) => {
      return (
        <div>
          <div class="ell" title={params.row.hospitalName}>{params.row.hospitalName}</div>
          <div class="gray ell" title={params.row.address}>{params.row.address}</div>
        </div>
      )
    }
  },
  {
    title: '关联标准套餐',
    key: 'relatedStandardMeal',
    render: (h, params) => {
      return (
        <div>
          <div class="ell" title={params.row.standardMealName}>{params.row.standardMealName}</div>
          {params.row.standardMealId ? <div class="gray" title={params.row.standardMealId}>ID: {params.row.standardMealId}</div> : ''}
        </div>
      )
    }
  },
  {
    title: '供货价',
    width: 120,
    key: 'supplyPrice',
    render: (h, p) => formatPrice(p.row.supplyPrice)
  },
  {
    title: '进货价',
    width: 120,
    key: 'purchasePrice',
    render: (h, p) => formatPrice(p.row.purchasePrice)
  },
  {
    title: '销售价',
    width: 120,
    key: 'salePrice',
    render: (h, params) => {
      return (
        <div>
          <div>{ formatPrice(params.row.salePrice) }</div>
          <div class="redfont" v-show={!params.row.mealSetting.lockPrice}>未锁定价格</div>
        </div>
      )
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (h, params) => {
      return (
        <div>
          <router-link class="mr10" to={{ path: 'detail', query: { mealId: params.row.id }}}>详情</router-link>
          <a class="dib" onClick={ context.relateStandardMeal.bind(this, params.row) }>关联标准套餐</a>
        </div>
      )
    }
  }
]
