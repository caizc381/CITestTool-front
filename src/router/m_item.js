import Main from '../views/m_item/Index'
import ItemManage from '../views/m_item/itemManage/index.js'

import ItemMatch from '../views/m_item/itemMap/ItemMatch'
import ReportItemMap from '../views/m_item/reportItemMap/ReportItemMap'



const m_item = [{
    path: '/medicalManager',
    component: Main,
    // 定义子路由
    children: [{
        path: 'itemManage',
        component: ItemManage
    }, {
        path: 'itemMap',
        component: ItemMatch
    }, {
        path: 'reportItemMap',
        component: ReportItemMap
    }]
}]

export default m_item;
