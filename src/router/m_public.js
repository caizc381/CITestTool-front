import Layout from '../components/layout'

import Login from '../views/m_public/login/login'
import UserCenter from '../views/m_public/usercenter/index.vue';
import UpdatePassword from '../views/m_public/usercenter/updatepassword/updatePassword'
import EntityCard from '../views/m_public/entitycard/index'

const module_public = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/m',
    component: Layout,
    children: [
      {
        path: 'public/usercenter',
        component: UserCenter,
        children: [
          {
            path: 'updatepassword',
            component: UpdatePassword
          }
        ]
      }
    ]
  },
  {
    path: '/m',
    component: Layout,
    children: [
      {
        path: 'entitycard',
        component: EntityCard
      }
    ]
  },
  {
    path: '/public/updatepassword',
    component: UpdatePassword
  },

]

export default module_public;
