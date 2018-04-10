import Layout from '../components/layout'

import M_order from '../views/m_order/index'
import OrderManage from '../views/m_order/ordermanage/orderManage'

const module_order = [
  {
    path: '/m',
    component: Layout,
    children: [
      {
        path: 'order',
        component: M_order,
        children: [
          {
            path: 'manage',
            component: OrderManage
          }
        ]
      },
    ]
  }
]

export default module_order;
