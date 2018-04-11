import Main from '../views/m_companyManage/Index'
import ChannelCompany from '../views/m_companyManage/channel/ChannelCompany'
import ChannelCompanyCreate from '../views/m_companyManage/channel/ChannelCompanyCreate'
import ChannelCompanyEdit from '../views/m_companyManage/channel/ChannelCompanyEdit'

import PlatformCompany from '../views/m_companyManage/platform/PlatformCompany'
import PlatformCompanyCreate from '../views/m_companyManage/platform/PlatformCompanyCreate'
import PlatformCompanyEdit from '../views/m_companyManage/platform/PlatformCompanyEdit'


const m_companyManage = [{
    path: '/companyManage',
    component: Main,
    // 定义子路由
    children: [{
        path: 'channelCompany',
        component: ChannelCompany
    },{
        path: 'channelCompany/create',
        component: ChannelCompanyCreate
    },{
        path: 'channelCompany/edit/:channelCompanyId',
        component: ChannelCompanyEdit
    },{
        path: 'platformCompany',
        component: PlatformCompany
    },{
        path: 'platformCompany/create',
        component: PlatformCompanyCreate
    },{
        path: 'platformCompany/edit/:platformCompanyId',
        component: PlatformCompanyEdit
    }]
}]

export default m_companyManage;
