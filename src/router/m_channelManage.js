import Main from '../views/m_channelManage/Index'

import BalanceManage from '../views/m_channelManage/balanceManage/BalanceManage'
import LowBalanceWarning from '../views/m_channelManage/balanceManage/LowBalanceWarning'
import Manager from '../views/m_channelManage/manager/index.js'
import Rechange from '../views/m_channelManage/manager/RechargeRecord'
import Channel from '../views/m_channelManage/channel/list/index.js'
import EditChannel from '../views/m_channelManage/channel/editChannel/index.js'
import Discount from '../views/m_channelManage/discount/Discount'
import Distribution from '../views/m_channelManage/hosDistribution/Distribution'

const m_channelManage = [{
    path: '/channelManage',
    component: Main,
    // 定义子路由
    children: [{
      path: 'balanceManage',
      component: BalanceManage
    },{
      path: 'balanceManage/lowBalanceWarning/:hosId',
      component: LowBalanceWarning
    },{
        path: 'managermanagement',
        component: Manager
    },{
        path: 'managermanagement/rechange/:managerId',
        component: Rechange
    },{
        path: 'channelList',
        component: Channel
    },{
        path: 'channelList/edit/:channelId',
        component: EditChannel
    },{
        path: 'discount',
        component: Discount
    },{
        path: 'distribution',
        component: Distribution
    }]
}]

export default m_channelManage;