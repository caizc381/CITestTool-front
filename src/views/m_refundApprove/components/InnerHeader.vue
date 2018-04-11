<template>
  <div class="page-header">
    <div class="ops-form">
      <div class="ops-form-row">
        <span class="ops-form-row-header tl word3">体检人:</span>
        <Input class="ops-form-row-ipt ml10" v-model="terms.account" placeholder="搜索体检人姓名/身份证/手机号" @on-click="handleChange" icon="search" @keyup.native.enter="handleChange"></Input>

        <span class="ops-form-row-header tr word3">地区:</span>
        <Cascader 
         class="dlb ml10"
         :data="areaList" 
         v-model="terms.addressIds"
         :clearable="true"
         :change-on-select="true"
         @on-change="changeAddress"
         style="width: 200px">
        </Cascader>

        <span class="ops-form-row-header ml10">体检机构:</span>
        <mt-select
         style="width:200px"
         class="ml10"
         v-model="terms.fromSite"
         placeholder="请选择体检机构"
         @on-change="selectHospital"
         :filters="['name', 'pinyin']"
         :options="hospitals">
        </mt-select>
        <mt-select
         style="width:200px"
         v-model="terms.hospitalCompanyId"
         placeholder="请选择单位"
         @on-change="handleChange"
         :filters="['name','pinyin']"
         :options="companies"
         :disabled="!terms.fromSite">
        </mt-select>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: 'InnerHeader',
  data() {
    return {
      hospitals: [
      ],
      companies: [
      ],
      areaList: [],
      terms: {
        account: '',
        fromSite: undefined,
        hospitalCompanyId: undefined,
        addressIds: [],
      }
    };
  },

  methods: {
    selectHospital() {
      this.getCompanyList();
      if (this.terms.companyId) {
        this.terms.hospitalCompanyId = undefined;
      } else {
        this.terms.hospitalCompanyId = undefined;
        this.handleChange();
      }
    },

    handleChange() {
      this.$emit('handleChange', this.terms);
    },

    changeAddress(val) {
      this.terms.addressIds = val
      this.getHospital();
      this.handleChange();
    },

    //加载单位列表
    getCompanyList() {
      if (!this.terms.fromSite) {
        this.companies = [];
        return;
      }

      this.$http.get('/hospital/listCompany?hospitalId=' + this.terms.fromSite).then((response) => {
        let companies = response.body;
        this.companies = companies;
      }, (res) => {
      })
    },

    //加载地区列表
    getAreaList() {
        this.$http.get('/hospital/queryArea').then((response) => {
            this.areaList = response.body.provinces;
        }, (res) => {
            this.$message({
                message: res.text,
                type: 'warning'
            })
        })
    },

    getHospital() {
      var queryOrganizationAddressVal = {
        provinceId: this.terms.addressIds[0],
        cityId: this.terms.addressIds[1],
        districtId: this.terms.addressIds[2],
      }
      this.$http.post('/hospital/queryOrg', JSON.stringify(queryOrganizationAddressVal)).then((response) => {
        let hospitals = response.body.filter(item => { return item.orgType == 1; });
        this.hospitals = hospitals;
      }, (res) => {
      });
    },

  },

  computed: {
  },

  mounted(){
    this.getHospital();

    this.getAreaList();

  }
};
</script>

<style scoped lang="less">
.page-header {
  background: #f7f7f7;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  border-bottom: 1px solid #eaeefb;
}
.word3 {
  width: 46px;
}
</style>
