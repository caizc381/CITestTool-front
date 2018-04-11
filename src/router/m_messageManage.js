import Main from '../views/m_messageManage/Index'
import Message from '../views/m_messageManage/message/index'
import Email from '../views/m_messageManage/email/index'

import Feedback from '../views/m_messageManage/feedback'
import FeedbackList from '../views/m_messageManage/feedback/list'
import FeedbackDetail from '../views/m_messageManage/feedback/detail'

const m_messageManage = [{
    path: '/messageManage',
    component: Main,
    // 定义子路由
    children: [{
        path: 'message',
        component: Message
    },{
        path: 'email',
        component: Email
    },{
        path: 'feedback',
        component: Feedback,
        redirect: 'feedback/list',
        children: [{
            path: 'list',
            component: FeedbackList
        }, {
            path: 'detail',
            component: FeedbackDetail
        }]
    }]
}]

export default m_messageManage;