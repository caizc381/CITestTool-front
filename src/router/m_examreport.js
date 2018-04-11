import Main from '../views/m_examreport/Index'
import JobList from '../views/m_examreport/jobList/index.js'
import ParseRule from '../views/m_examreport/parseRule/index.js'

const m_examreport = [
{
  path: '/examreport',
  component: Main,
  // 定义子路由
  children: [{
    path: 'jobList',
    component: JobList
  },
  {
    path: 'parseRule',
    component: ParseRule
  }]
}]

export default m_examreport;