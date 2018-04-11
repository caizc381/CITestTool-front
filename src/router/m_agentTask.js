import Main from '../views/m_agentTask/Index'
import HospitalListTask from '../views/m_agentTask/hospitallist/index.js'



const m_agentTask = [{
    path: '/sysTaskManager',
    component: Main,
    // 定义子路由
    children: [{
        path: 'listTask',
        component: HospitalListTask
    }]
}]

export default m_agentTask;