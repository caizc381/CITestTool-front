<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
         <Breadcrumb-item href="/companyManage/platformCompany">平台单位列表</Breadcrumb-item>
         <Breadcrumb-item>新建平台单位</Breadcrumb-item>
      </Breadcrumb>
    </div>

    <div class="pt20 ml15">
      <div>
        <label>单位名称：</label>
        <i-input readonly style="width: 200px;" v-model="platformCompany.name" placeholder="请输入名称"></i-input>
        <label>[P]单位</label>
      </div>

    </div>

    <div class="pt20 ml15">
      <Tabs v-model="focusTab">

        <Tab-pane label="医院申请" name="医院申请" icon="ios-medkit">
          <Row>
            <i-col span="12" style="padding-right: 20px;">
                <div class="assign-table">
                  <div class="assign-table-head">
                    <Icon type="ios-checkmark-outline"></Icon> 已申请的体检中心
                  </div>
                  <div class="assign-table-body">
                    <div><Input v-model="searchAppHos" icon="ios-search" placeholder="请输入名称搜索..." style="width: 100%" /></div>
                    <div class="assign-table-body-table" v-bind:style="{'height': height}">
                      <table class="mt-table mt-table-tc">
                        <tr>
                          <th>ID</th>
                          <th>体检中心名称</th>
                          <th>单位折扣</th>
                          <th>报告是否可见</th>
                          <th></th>
                        </tr>
                        <tr v-show="hospitalApplyList.length == 0"><td colspan="5"><Icon type="ios-folder-outline"></Icon> 未申请体检中心</td></tr>
                        <tr v-for="hosApp in filterHospitalApplyList" :key="hosApp.hospitalId">
                          <td><span>{{hosApp.hospitalId}}</span></td>
                          <td><span>{{hosApp.hospitalName}}</span></td>
                          <td>{{hosApp.discount}}</td>
                          <td>{{hosApp.showReport | boolean}}</td>
                          <td>
                            <span v-if="hosApp.add" class="hoverblue" @click="cancelApply(hosApp);">取消申请</span>
                            <span v-else><Tag type="border" :color="getStatusColor(hosApp.status)">{{hosApp.status | appStatus}}</Tag></span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
            </i-col>
            <i-col span="12" style="padding-left: 20px;">
              <div class="assign-table">
                <div class="assign-table-head">
                  所有体检中心
                </div>
                <div class="assign-table-body">
                  <div><Input v-model="searchAllHos" icon="ios-search" placeholder="请输入简拼或名称搜索..." style="width: 100%" /></div>
                  <div class="assign-table-body-table" v-bind:style="{'height': height}">
                    <table class="mt-table">
                      <tr>
                        <th>体检中心名称</th>
                        <th></th>
                      </tr>
                      <tr v-for="hos in filterAllHospital" :key="hos.id">
                        <td><span>{{hos.name}}</span></td>
                        <td>
                          <span class="hoverblue" v-if="unapplied(hos.id)" @click="apply(hos)">申请</span>
                          <span v-else><Tag type="border" :color="getStatusColor(getAppStatus(hos))">{{ getAppStatus(hos) | appStatus }}</Tag></span>
                        </td>
                      </tr>
                    </table>
                  </div>

                </div>
              </div>
            </i-col>
          </Row>
        </Tab-pane>

        <Tab-pane label="渠道分配" name="渠道分配" icon="person-add">
          <Row>
            <i-col span="12">
              <Row>
                <i-col span="12" style="padding-right: 10px;">
                    <div class="assign-table">
                      <div class="assign-table-head">
                        <Icon type="ios-checkmark-outline"></Icon> 已分配的渠道机构
                      </div>
                      <div class="assign-table-body">
                        <div><Input v-model="searchSelectChannel" icon="ios-search" placeholder="请输入名称搜索..." style="width: 100%" /></div>
                        <div class="assign-table-body-table" v-bind:style="{'height': height}">
                          <table class="mt-table mt-table-tc">
                            <tr v-show="supportChannelList.length == 0"><td colspan="2"><Icon type="ios-folder-outline"></Icon> 未分配渠道机构</td></tr>
                            <tr :class="{'on': currentChannel == chn.id}" v-for="chn in filterSupportChannelList" @click="toggleChannel(chn)" :key="chn.id">
                              <td><span class="ellipsis">{{chn.name}}</span></td>
                              <td>
                                <span v-show="chn.add" class="hoverblue" @click.stop="handleRemoveChannel(chn)">取消</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                </i-col>
                <i-col span="12" style="box-shadow: 5px 5px 5px #eee;">
                  <div class="assign-table">
                    <div class="assign-table-head">
                      所有渠道机构
                    </div>
                    <div class="assign-table-body" style="box-shadow: 5px 5px 5px #eee;">
                      <div><Input v-model="searchChannel" icon="ios-search" placeholder="请输入简拼或名称搜索..." style="width: 100%" /></div>
                      <div class="assign-table-body-table" v-bind:style="{'height': height}">
                        <table class="mt-table">
                          <tr v-for="chn in filterAllChannelList" :key="chn.id">
                            <td><span class="ellipsis">{{chn.name}}</span></td>
                            <td><span v-show="isSelectedChannel(chn)" class="hoverblue" @click="handleAddChannel(chn)">选择</span></td>
                          </tr>
                        </table>
                      </div>

                    </div>
                  </div>
                </i-col>

              </Row>
            </i-col>

            <i-col span="12">

              <Row>
                <i-col span="12" style="padding-right: 10px;padding-left: 10px;">
                    <div class="assign-table">
                      <div class="assign-table-head">
                        <Icon type="ios-checkmark-outline"></Icon> 已分配的客户经理
                      </div>
                      <div class="assign-table-body">
                        <div><Input v-model="searchSelectManager" icon="ios-search" placeholder="请输入姓名搜索..." style="width: 100%" /></div>
                        <div class="assign-table-body-table" v-bind:style="{'height': height}">
                          <table class="mt-table mt-table-tc">
                            <tr v-show="companyManagerList.length == 0"><td colspan="2"><Icon type="ios-folder-outline"></Icon> 未分配客户经理</td></tr>
                            <tr v-for="man in filterCompanyManagerList" v-show="man.addOrRemove !== -1" :key="man.id">
                              <td><span class="ellipsis">{{man.name}}</span></td>
                              <td>
                                <span class="hoverblue" @click="unassignManager(man)">取消</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                </i-col>
                <i-col span="12">
                  <div class="assign-table">
                    <div class="assign-table-head">
                      当前渠道下所有客户经理
                    </div>
                    <div class="assign-table-body">
                      <div><Input v-model="searchAllManager" icon="ios-search" placeholder="请输入姓名搜索..." style="width: 100%" /></div>
                      <div class="assign-table-body-table" v-bind:style="{'height': height}">
                        <table class="mt-table">
                          <tr v-show="managersInChannel.length == 0"><td colspan="2"><Icon type="ios-folder-outline"></Icon> 无客户经理</td></tr>
                          <tr v-for="man in filterManagersInChannel" :key="man.id">
                            <td><span class="ellipsis">{{man.name}}</span></td>
                            <td><span class="hoverblue" @click="assignManager(man)" v-show="isSelectedManager(man)">选择</span></td>
                          </tr>
                        </table>
                      </div>

                    </div>
                  </div>
                </i-col>
              </Row>

            </i-col>
          </Row>
        </Tab-pane>

      </Tabs>
    </div>

    <save-footer @on-submit="save"></save-footer>

  </div>
</template>

<script>
import SaveFooter from 'components/SaveFooter'

export default {
  name: 'ChannelCompanyCreate',
  components: {
    'save-footer': SaveFooter,
  },
  data() {
      return {
        height: '',
        focusTab: '医院申请',
        searchAllHos: '',
        searchAppHos: '',

        searchChannel: '',
        searchSelectChannel: '',

        searchAllManager: '',
        searchSelectManager: '',

        platformCompany: { name: '' },
        allHospList: [],
        allChannelList: [],
        hospitalApplyList: [],

        supportChannelList: [],
        companyManagerList: [],

        currentChannel: undefined,
        managersInChannel: [],

      }
  },

  filters: {
    appStatus: function(value) {
      let str = '';
      if (value == 0) {
        str = '申请中';
      } else if (value == 1) {
        str = '已支持';
      } else if (value == 2) {
        str = '已拒绝'
      }
      return str;
    },
  },

  computed: {
    filterAllHospital() {
      return this.allHospList.filter(item => {
        return (item.name && item.name.indexOf(this.searchAllHos) > -1) || (item.pinyin && item.pinyin.indexOf(this.searchAllHos) > -1);
      });
    },

    filterHospitalApplyList() {
      return this.hospitalApplyList.filter(item => {
        return item.hospitalName && item.hospitalName.indexOf(this.searchAppHos) > -1;
      });
    },

    filterAllChannelList() {
      return this.allChannelList.filter(item => {
        return (item.name && item.name.indexOf(this.searchChannel) > -1) || (item.pinyin && item.pinyin.indexOf(this.searchChannel) > -1);
      });
    },

    filterSupportChannelList() {
      return this.supportChannelList.filter(item => {
        return item.name && item.name.indexOf(this.searchSelectChannel) > -1;
      });
    },

    filterManagersInChannel() {
      return this.managersInChannel.filter(item => {
        return item.name && item.name.indexOf(this.searchAllManager) > -1;
      });
    },

    filterCompanyManagerList() {
      return this.companyManagerList.filter(item => {
        return item.name && item.name.indexOf(this.searchSelectManager) > -1 && item.organizationId == this.currentChannel;
      });
    },

  },

  mounted() {
    this.height = (window.innerHeight -380) + 'px';

    this.getPlatformCompanyById(this.$route.params.platformCompanyId)
  },

  methods: {
    getPlatformCompanyById(id) {
      this.$http.get('/company/platform/companyInfo?companyId=' + id).then((response) => {
        this.platformCompany = response.body.platformCompany;
        this.allHospList = response.body.allHospList || [];
        this.hospitalApplyList = response.body.hospitalApplyList || [];

        this.allChannelList = response.body.allChannelList || [];
        this.supportChannelList = response.body.supportChannelList || [];
        this.companyManagerList = this.parseAssignManager(response.body.companyManagerList || []);

        if (this.supportChannelList.length > 0) {
          this.toggleChannel(this.supportChannelList[0]);
        }
      });
    },

    parseAssignManager(manageList) {
      // 转化一下数据结构，方便之后操作
      manageList = manageList.map(item => {
        item.id = item.managerId;
        item.organizationId = item.hospitalId;
        item.name = item.managerName;
        item.addOrRemove = undefined;
        return item;
      })
      this.companyManagerListBak = Object.assign([], manageList); // 备份已经分配的客户经理，保存的时候对比是新增还是解除

      return manageList;
    },

    isSelectedChannel(chn) {
      return !this.supportChannelList.some((item) => {
        return item.id == chn.id;
      })
    },

    isSelectedManager(man) {
      return !this.companyManagerList.filter(item => { return item.addOrRemove !== -1 }).some((item) => {
        return item.id == man.id;
      })
    },

    handleRemoveChannel(chn) {
      this.supportChannelList = this.supportChannelList.filter(item => {
        return item.id != chn.id;
      })
      // 移除该渠道的客户经理
      this.companyManagerList = this.companyManagerList.filter(item => {
        return item.organizationId != chn.id;
      })
      this.currentChannel = this.supportChannelList[0];
      this.managersInChannel = [];
    },

    handleAddChannel(chn) {
      chn.add = true;
      this.supportChannelList.unshift(chn);
      this.toggleChannel(chn);
    },

    toggleChannel(channel) {
      this.currentChannel = channel.id;
      this.$http.get('/company/channel/getManagerByChannel?organizationId=' + channel.id).then((response) => {
        this.managersInChannel = response.body || [];

      });
    },

    assignManager(mana) {
      if (this.exist(this.companyManagerListBak, mana)) {
        mana.addOrRemove = undefined;
      } else {
        mana.addOrRemove = 1;
      }

      this.companyManagerList.unshift(mana);
    },

    unassignManager(mana) {
      if (this.exist(this.companyManagerListBak, mana)) {
        mana.addOrRemove = -1;
      } else {
        mana.addOrRemove = undefined;
        this.companyManagerList = this.companyManagerList.filter(item => {
          return item.id != mana.id;
        })
      }

    },

    save() {
      if (this.focusTab == '医院申请') {
        this.saveHosApply();
      } else if (this.focusTab == '渠道分配') {
        this.saveAssignChannel();
      }

    },

    saveHosApply() {
      let hospitalList = this.hospitalApplyList.filter(item => {
        return item.add;
      }).map(item => {
        return item.hospitalId;
      })

      if (hospitalList.length == 0) {
        this.$Notice.success({desc: '保存成功'});
        return;
      }

      let params = {
        platformCompany: this.platformCompany,
        hospitalList: hospitalList,
      }
      this.$http.post('/company/platform/updateCompanyAndHospApply', JSON.stringify(params)).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.$router.push('/companyManage/platformCompany');
      }, (error) => {
        this.$Notice.error({desc: error.text});
      });
    },

    saveAssignChannel() {
      let channelList = this.getAddChannel();
      let channelManagerList = this.getChangedManagerList();

      let params = {
        platformCompany: this.platformCompany,
        channelList: channelList,
        channelManagerList, channelManagerList,
      }

      this.$http.post('/company/platform/updateChannelAndManager', JSON.stringify(params)).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.$router.push('/companyManage/platformCompany');
      }, (error) => {
        this.$Notice.error({desc: error.text});
      });
    },

    getAddChannel() {
      return this.supportChannelList.filter(item => {
        return item.add;
      }).map(item => {
        return item.id;
      })

    },

    getChangedManagerList() {
      // 只把新增 或 删除 的客户经理传到后端
      return this.companyManagerList.filter(item => {
        return item.addOrRemove === -1 || item.addOrRemove === 1
      });
    },

    // 判断是否是已经分配过的客户经理
    exist(list, item) {
      return list.some(it => {
        return it.id == item.id;
      })
    },

    apply(hos) {
      if (this.isRefusedApply(hos.id)) {
        this.hospitalApplyList = this.hospitalApplyList.map(item => {
          if (item.hospitalId == hos.id) {
            item.add = true;
          }
          return item;
        })
      } else {
        let hosApply = {hospitalId: hos.id, hospitalName: hos.name,discount:1,showReport:hos.settings.showCompanyReport, add: true};
        this.hospitalApplyList.unshift(hosApply);
      }
    },

    cancelApply(hos) {
      if (hos.status == 2) {
        this.hospitalApplyList = this.hospitalApplyList.map(item => {
          if (item.hospitalId == hos.hospitalId) {
            item.add = false;
          }
          return item;
        })
      } else {
        this.removeApply(hos.hospitalId);
      }
    },

    removeApply(hosId) {
      this.hospitalApplyList = this.hospitalApplyList.filter(item => {
        return item.hospitalId != hosId;
      });
    },

    unapplied(id) {
      let unapplied = !this.hospitalApplyList.some((item) => {
        return item.hospitalId == id;
      });
      return unapplied || this.isRefusedApply(id);
    },

    isRefusedApply(hosId) {
      return this.hospitalApplyList.some((item) => {
        return item.hospitalId == hosId && item.status == 2 && !item.add;
      });
    },

    getStatusColor(sta) {
      let color = 'green';
      if (sta == 0) {
        color = 'yellow';
      } else if (sta == 1) {
        color = 'blue';
      } else if (sta == 2) {
        color = 'red'
      }
      return color;
    },

    getAppStatus(hos) {
      let sta = 0;
      this.hospitalApplyList.forEach(item => {
        if (item.hospitalId == hos.id) {
          if (item.status == 1) {
            sta = 1;
          } else {
            sta = 0;
          }
        }
      })
      return sta;
    },

  }
};
</script>

<style lang="less">
.assign-table {
  .assign-table-head {
    padding: 10px;
    background: #f9fafc;
    color: #495060;
    border: 1px solid #dddee1;
    border-bottom: 1px solid #e9eaec;
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    width: 100%;
  }
  .assign-table-body {
    padding: 10px 10px 0px 10px;
    border: 1px solid #dddee1;
    border-top: none;
    border-radius: 0 0 6px 6px;
    overflow-x: auto;
    .assign-table-body-table {
      margin-top: 10px;
      overflow: auto;
      padding-bottom: 10px;
    }
    table {
      border-radius: 6px;
    }
  }
}

.ellipsis {
  display: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.pt20 {
  padding-top: 20px;
}
.mt20 {
  margin-top: 20px;
}

.breadcrumb {
  padding: 10px 0px;
  border-bottom: 1px solid #eee;
}

.transfer {
  position: relative;
  .transfer-icon {
    position: absolute;
    padding: 5px 10px;
    margin-left: 5px;
    border: 1px solid #eee;
    border-radius: 3px;
    top: 100px;
  }
}
</style>
