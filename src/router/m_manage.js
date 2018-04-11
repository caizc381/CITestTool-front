import Main from '../views/m_manage/Index'
import Withdraw from '../views/m_manage/withdraw/withdraw.vue'
import Theme from '../views/m_manage/theme'
import Wxsetting from '../views/m_manage/wxsetting'

const m_manage = [{
    path: '/manage',
    component: Main,
    // 定义子路由
    children: [{
        path: 'withdraw',
        component: Withdraw
    },{
        path: 'wx',
        component: Wxsetting
    },{
        path: 'resource',
        component: Theme
    }]
}]

export default m_manage;
