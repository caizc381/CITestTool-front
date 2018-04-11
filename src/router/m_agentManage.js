import Main from '../views/m_agentManage/Index'
import Agent from '../views/m_agentManage/agent/index.js'

const m_agentManage = [{
    path: '/agentManage',
    component: Main,
    // 定义子路由
    children: [{
        path: 'agent',
        component: Agent
    }]
}]

export default m_agentManage;