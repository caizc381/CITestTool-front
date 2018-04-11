import Main from '../views/m_sysManage/Index'
import AuthorizeList from '../views/m_sysManage/authorizeList/index.js'
import DepartmentList from '../views/m_sysManage/departmentList/index.js'
import MenuList from '../views/m_sysManage/menuList/index.js'
import RoleList from '../views/m_sysManage/roleList/index.js'
import UserList from '../views/m_sysManage/userList/index.js'
import UserInfo from '../views/m_sysManage/userInfo/index.js'
import PersonalProfile from '../views/m_sysManage/personalProfile/index.js'


const m_sysManager = [{
    path: '/sysManager',
    component: Main,
    // 定义子路由
    children: [{
        path: 'authorizeList',
        component: AuthorizeList
    }, {
        path: 'departmentList',
        component: DepartmentList
    }, {
        path: 'menuList',
        component: MenuList
    }, {
        path: 'roleList',
        component: RoleList
    }, {
        path: 'userList',
        component: UserList
    }]
}, {
    path: '/m_user',
    component: Main,
    // 定义子路由
    children: [{
        path: 'userInfo',
        component: UserInfo
    }]
},{
    path: '/m_user',
    component: Main,
    // 定义子路由
    children: [{
        path: 'personalProfile',
        component: PersonalProfile
    }]
}]

export default m_sysManager;