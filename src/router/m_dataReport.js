import Main from '../views/m_dataReport/Index'
import WxReport from '../views/m_dataReport/wxReport/index.js'
import OrderSourceReport from '../views/m_dataReport/orderSourceReport/index.js'
import PackageReport from '../views/m_dataReport/packageReport/index.js'
import OrderIncrementReport from '../views/m_dataReport/orderIncrementReport/index.js'

const m_dataReport = [{
    path: '/dataReport',
    component: Main,
    // 定义子路由
    children: [{
        path: 'wxReport',
        component: WxReport
    },{
        path: 'orderSourceReport',
        component: OrderSourceReport
    },{
        path: 'packageReport',
        component: PackageReport
    },{
        path: 'orderIncrementReport',
        component: OrderIncrementReport
    }]
}]

export default m_dataReport;