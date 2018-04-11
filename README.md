# mt-crm

To start:

```bash
$ npm install
```

To develop:

```bash
$ npm run dev
```

To build for production:

```bash
$ npm run build
```

To lint you code:

```bash
$ npm run lint
```

## 项目配置
本地调试如果要使用自定义的后端地址，修改src/api.js的urlBase，同时需要把src/api.js的useCustomizedPath设成 true。否则默认使用当前服务器后端

## 项目结构
build/          webpack配置
node_modules/   依赖
src/            项目主体目录
├─assets 资源目录
│  ├─images 图片资源
│  └─style  样式文件
├─common  通用js  
├─components  组件目录
│  └─ui
├─directives 自定义指令
├─filters 过滤器
├─router  路由
├─store vuex
│  └─employinfo 模块化的vuex
├─util  工具
└─views 页面目录
    ├─m_agentManage Agent管理
    │  └─agent 
    ├─m_agentTask 
    │  └─hospitallist 医院任务管理
    ├─m_channelManage 渠道商管理
    │  └─balanceManage  余额管理
    │      └─components
    ├─m_companyManage 单位管理
    │  ├─channel  渠道单位
    │  └─platform 平台管理
    ├─m_dataReport  数据统计
    │  ├─orderIncrementReport 订单增量统计
    │  ├─orderSourceReport  订单来源统计
    │  ├─packageReport  套餐统计
    │  └─wxReport 微信统计
    ├─m_examreport  体检报告
    │  ├─jobList  解析任务
    │  └─parseRule  解析规则
    ├─m_hospitalManage  体检中心管理
    │  ├─createHospital 新增体检中心
    │  ├─editHospital 编辑
    │  │  ├─basic 基本信息
    │  │  ├─contract  签约对接
    │  │  ├─cooperation 平台合作
    │  │  ├─function  功能配置
    │  │  ├─message 消息设置
    │  │  ├─questionnaire 问卷分配
    │  │  └─site  站点设置
    │  └─hospitalList 详情
    │      ├─basic
    │      ├─cooperation
    │      ├─function
    │      ├─sign
    │      └─site
    ├─m_item  体检项目
    │  ├─itemManage 单项管理
    │  └─itemMap  单项映射
    ├─m_manage  
    │  ├─email  邮件发送查询
    │  └─message  短信发送查询
    ├─m_mealManage  套餐管理
    ├─m_public  
    │  └─login  登录
    ├─m_refundApprove 退款审批
    │  └─components
    ├─m_settlement  结算系统
    │  ├─consumption  消费额度
    │  ├─payment  付款账单
    │  ├─recordList 付款记录
    │  └─refund 特殊退款
    └─m_sysManage 系统管理
        ├─authorizeList 授权管理
        ├─departmentList   部门列表
        ├─menuList  菜单管理
        ├─roleList  角色管理
        ├─userInfo  管理员信息
        └─userList  管理员列表
static          静态文件目录
.babelrc        babel配置文件
.eslintrc       eslint配置文件
.gitignore      git配置，忽略提交配置
package.json    依赖管理文件



