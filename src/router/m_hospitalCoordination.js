import Main from '../views/m_hospitalCoordination/Index'
import Progress from './../views/m_hospitalCoordination/progress/index.vue'
import Cost from './../views/m_hospitalCoordination/cost/index.vue'

const m_module = [{
  path: '/hospitalCoordination',
  component: Main,
  children: [{
    path: 'progress',
    component: Progress
  }, {
    path: 'cost',
    component: Cost
  }]
}]

export default m_module