import Main from '../views/m_hospitalManage/Index'
import HospitalList from '../views/m_hospitalManage/hospitalList/index.js'
import CreateHospital from '../views/m_hospitalManage/createHospital/index.js'
import Template from '../views/m_hospitalManage/createHospital/previewTemplate'
import EditHospital from '../views/m_hospitalManage/editHospital/index.js'
import InitializeList from '../views/m_hospitalManage/hospitalList/components/InitializeList'
import ExportErrorHospitals from '../views/m_hospitalManage/hospitalList/exportErrorHospitals.vue'

const m_hospitalManage = [{
    path: '/hospitalManage',
    component: Main,
    // 定义子路由
    children: [{
      path: 'list',
      component: HospitalList
    },{
      path: 'list/initializeList',
      component: InitializeList
    },{
      path: 'list/create',
      component: CreateHospital
    },{
      path: 'list/edit/:tab/:hospitalId',
      component: EditHospital
    }]
},{
    path: '/preview',
    component: Template
},{
  path: '/showErrorHos',
  component: ExportErrorHospitals
}]

export default m_hospitalManage;
