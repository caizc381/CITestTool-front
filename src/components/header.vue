<template>
<div class="header">

    <div>
      <span class="title">
        <i style="font-size:44px;" class="iconfont icon-ops"></i>
        <span>运维平台</span>
      </span>
      <ul class="header-menu">
        <li class="header-menu-module" v-bind:class="{'active': sysMenu.active}"
        @click="handleChangeMenu(sysMenu)"
        v-for="(sysMenu, index) in sys_menu" :key="index">
          {{ sysMenu.desc }}
        </li>
      </ul>
    </div>

    <div class="right-part">
      <Dropdown trigger="click">
        <span class="username-icon"><Icon type="ios-person"></Icon></span>
        <a href="javascript:void(0)" class="right-part-username">
            {{ loginName }}
            <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem @click.native="$router.push('/m_user/userInfo')">个人信息</DropdownItem>
            <DropdownItem @click.native="$router.push('/m_user/personalProfile')">个人资料</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <a style="margin-left: 10px;" @click="logout" >退出</a>
   </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginName: '',
      // 按系统划分后的菜单分类（所有菜单项，未按权限过滤）
      sys_menu: [],
      sys_menu_map: [
        // 运营管理
        {
          name: 'operationManage',
          desc: '运营管理',
          totalMenus: [
            '/manage/withdraw',
            '/manage/wx',
            '/manage/resource',
          
            '/medicalManager/itemManage',
            '/medicalManager/itemMap',
            '/medicalManager/reportItemMap',

            '/refundApprove/willApprove',
            '/refundApprove/doApproved',

            '/companyManage/channelCompany',
            '/companyManage/platformCompany',

            '/hospitalManage/list',

            '/settle/record',
            '/settle/payment',
            '/settle/refund',
            '/settle/consumption',

            '/mealManage/platformMeal',
            '/mealManage/standardMeal',

            '/channelManage/balanceManage',
            '/channelManage/channelList',
            '/channelManage/managermanagement',
            '/channelManage/discount',
            '/channelManage/distribution',
            
            '/orderAndUser/user',
            '/orderAndUser/order',

            '/messageManage/message',
            '/messageManage/email',
            '/messageManage/feedback',
          ]
        },
        //协同工作
        {
          name: 'coordination',
          desc: '协同工作',
          totalMenus: [
            '/hospitalCoordination/progress',
            '/hospitalCoordination/cost'
          ]
        },
        // 数据统计
        {
          name: 'dataStatistics',
          desc: '数据统计',
          totalMenus: [
            '/dataReport/wxReport',
            '/dataReport/orderSourceReport',
            '/dataReport/packageReport',
            '/dataReport/orderIncrementReport',
          ]
        },
        // 账务
        {
          name: 'accounting',
          desc: '账务',
          totalMenus: [
          ]
        },
        // 运维监控
        {
          name: 'monitor',
          desc: '运维监控',
          totalMenus: [
            '/examreport/jobList',
            '/examreport/parseRule',
            '/sysTaskManager/list',
            '/sysTaskManager/listTask',
            '/agentManage/agent',
          ]
        },
        // 系统管理
        {
          name: 'systemManage',
          desc: '系统管理',
          totalMenus: [
            '/sysManager/authorizeList',
            '/sysManager/departmentList',
            '/sysManager/menuList',
            '/sysManager/roleList',
            '/sysManager/userList'
          ]
        }
      ],
    }
  },

  mounted(){
    this.loginName = localStorage.loginName;
    this.$http.get('/sys/menu/user').then((response) => {
      this.menuList = response.body;
      this.menuFilter(this.menuList);
      this.setMenuActive(this.$route.path);
    })
  },

  methods: {
    setMenuActive(path) {
      this.sys_menu.forEach((item) => {
        item.active = false;
        for (let i=0; i<item.totalMenus.length; i++) {
          let mu = item.totalMenus[i];
          if (path.indexOf(mu) > -1) {
            item.active = true;
            this.$store.dispatch('change_left_menu', item.menu);
            break;
          }
        }

      })
    },

    handleChangeMenu(sysMenu) {
      if (!sysMenu.active) {
        let parentMenu = sysMenu.menu[0];
        let path = parentMenu.menuUrl + parentMenu.list[0].menuUrl;
        this.$router.push(path);
      }
    },

    menuFilter(userMenus) {
      this.sys_menu = this.sys_menu_map.filter((sysMenu) => {
        this.getUserMenuBySys(userMenus, sysMenu);
        return sysMenu.menu.length > 0 ;
      })
    },

    // 根据后台返回的用户授权菜单，映射出前端显示的菜单
    getUserMenuBySys(userMenus, sysMenu) {
      let userMenusCopy = JSON.parse(JSON.stringify(userMenus));

      let menu = userMenusCopy.filter((parentMenu) => {
        let childMenu = parentMenu.list || [];

        let userChildMenu = childMenu.filter((item) => {
          return sysMenu.totalMenus.indexOf(parentMenu.menuUrl + item.menuUrl) > -1;
        })
        parentMenu.list = userChildMenu;
        return parentMenu.list.length > 0;
      });
      sysMenu.menu = menu;

    },

    handleSelect(key, keyPath) {
      if (key != 3) {
        this.$router.push(key)
      }
    },

    logout() {

      this.$Modal.confirm({
        title: '提示',
        content: '确认退出',
        onOk: () => {
          this.$http.post('/user/logout')
           .then((response) => {
             this.$router.push({path: '/'});
           },(res) =>{
             this.$message({
               message:res.text,
             });
          });
        }
      })
    }

  }

}
</script>

<style scoped lang="less">
.title
{
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  display: inline-block;
  margin-left: 20px;
  margin-right: 50px;
  width: 150px;
  color: #fff;
  position:relative;
  span {
    position:absolute;
    top:0;
    left:50px;
    font-size: 20px;
    font-weight: 600;
  }
}
.header-menu {
  display: inline-block;
  margin: 0px;
  width: 60%;
  .header-menu-module {
    padding: 0 20px;
    height: 39px;
    box-sizing: border-box;
    display: inline-block;
    list-style: none;
    font-size: 16px;
    color: #8391a5;
    position: relative;
    &:hover {
      cursor: pointer;
      color: #20a0ff;
    }
    &.active {
      color: #20a0ff;
      border-bottom: 2px solid #20a0ff;
    }
  }
}
.header
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 2000;
  background-color: #30486a;
}
.right-part {
  font-size: 14px;
  position:absolute;
  top: 9px;
  right: 20px;
  height: auto;
  .right-part-username {
    color: #fff;
  }
  .username-icon {
    font-size: 19px;
    padding: 0;
    width: 30px;
    height: 30px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background: #48576a;
  }
  .ivu-icon {
    color: #8391a5
  }
}
.info{
  font-size: 0.6em;
}
</style>
