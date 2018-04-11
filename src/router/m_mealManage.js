import Main from '../views/m_mealManage/index'
import PlatformMealIndex from '../views/m_mealManage/platformMeal/Index'
import PlatformMealList from '../views/m_mealManage/platformMeal/List'
import EditPlatformMeal from '../views/m_mealManage/platformMeal/CreateOrUpdate'

import StandardMealIndex from '../views/m_mealManage/standardMeal/Index'
import StandardMealList from '../views/m_mealManage/standardMeal/List'
import EditStandardMeal from '../views/m_mealManage/standardMeal/CreateOrUpdate'

import MealDetail from '../views/m_mealManage/mealDetail'

const m_module = [{
    path: '/mealManage',
    component: Main,
    children: [{
      path: 'platformMeal',
      redirect: 'platformMeal/list',
      component: PlatformMealIndex,
      children: [{
        path: 'list',
        component: PlatformMealList
      }, {
        path: 'detail',
        component: MealDetail
      }, {
        path: 'edit',
        component: EditPlatformMeal
      }]
    }, {
      path: 'standardMeal',
      redirect: 'standardMeal/list',
      component: StandardMealIndex,
      children: [{
        path: 'list',
        component: StandardMealList
      }, {
        path: 'detail',
        component: MealDetail
      }, {
        path: 'edit',
        component: EditStandardMeal
      }]
    }]
},
// 重定向
{
  path: '/mealManage/platformMeal',
  redirect: '/mealManage/platformMeal/list'
}, {
  path: '/mealManage/standardMeal',
  redirect: '/mealManage/standardMeal/list'
}]

export default m_module
