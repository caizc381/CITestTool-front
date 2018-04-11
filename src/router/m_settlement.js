import Main from '../views/m_settlement/Index'
import RecordList from '../views/m_settlement/recordList/index.js'
import Payment from '../views/m_settlement/payment/index.js'
import SpecialRefund from '../views/m_settlement/refund/index.js'
import ConsumptionQuota from '../views/m_settlement/consumption/index.js'

const m_settlement = [{
    path: '/settle',
    component: Main,
    // 定义子路由
    children: [{
        path: 'record',
        component: RecordList
    },{
        path: 'payment',
        component: Payment
    },{
        path: 'refund',
        component: SpecialRefund
    },{
        path: 'consumption',
        component: ConsumptionQuota
    }]
}]

export default m_settlement;