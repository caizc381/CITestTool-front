import Main from '../views/m_refundApprove/Index'
import WillApprove from '../views/m_refundApprove/WillApprove'
import DoApproved from '../views/m_refundApprove/DoApproved'


const m_module = [{
    path: '/refundApprove',
    component: Main,
    // 定义子路由
    children: [{
      path: 'willApprove',
      component: WillApprove
    }, {
      path: 'doApproved',
      component: DoApproved
    }]
}]

export default m_module;
