import Vue from 'vue'
import Router from 'vue-router'

import m_public from './m_public'
import m_agentTask from './m_agentTask'
import m_sysManage from './m_sysManage'
import m_item from './m_item'
import m_examreport from './m_examreport'
import m_dataReport from './m_dataReport'
import m_manage from './m_manage'
import m_settlement from './m_settlement'
import m_refundApprove from './m_refundApprove'
import m_companyManage from './m_companyManage'
import m_agentManage from './m_agentManage'
import m_hospitalManage from './m_hospitalManage'
import m_mealManage from './m_mealManage'
import m_channelManage from './m_channelManage'
import m_orderAndUser from './m_orderAndUser'
import m_hospitalCoordination from './m_hospitalCoordination'
import m_messageManage from './m_messageManage'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    ...m_public,
    ...m_agentTask,
    ...m_sysManage,
    ...m_item,
    ...m_examreport,
    ...m_manage,
    ...m_dataReport,
    ...m_refundApprove,
    ...m_settlement,
    ...m_companyManage,
    ...m_agentManage,
    ...m_hospitalManage,
    ...m_mealManage,
    ...m_channelManage,
    ...m_orderAndUser,
    ...m_hospitalCoordination,
    ...m_messageManage
    ]
})
