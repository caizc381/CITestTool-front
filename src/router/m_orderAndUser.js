import Main from '../views/m_orderAndUser/Index'
import User from '../views/m_orderAndUser/User'
import Order from '../views/m_orderAndUser/order/Order'

const m_module = [{
  path: '/orderAndUser',
  component: Main,
  children: [{
    path: 'user',
    component: User
  }, {
    path: 'order',
    component: Order
  }]
}]

export default m_module
