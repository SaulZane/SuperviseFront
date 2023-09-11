<script setup lang="ts">
import { Ref, ref} from 'vue';

import axios, { AxiosError } from 'axios';
import { ElAlert, ElMessage, ElDialog } from 'element-plus';
import fileDownload from 'js-file-download';
import button from 'element-plus/es/components/button';
import dialog from 'element-plus/es/components/dialog';
import { el } from 'element-plus/es/locale';
import { template } from 'lodash';
import { auto } from '@popperjs/core';


let currentDate:Ref<Date>=ref(new Date());
let centerDialogVisible = ref(false)
let errorMassage: AxiosError;
let tableData=ref([{},])
let showtable:Ref<boolean>=ref(false);
let btnLoading:Ref<boolean> = ref(false);

//按钮点击事件
function handleClick() {
  btnLoading.value = true;
  downloaddata();

}
let downloadUrl = 'http://localhost:8000/static/工作日报.docx';//todo 在这里下载每日报表文件，别忘了最后修改成正式服务器地址

const downloadFile = async () => {
  let res;
  try {
    res = await axios.get(downloadUrl, { responseType: 'blob' })
    fileDownload(res.data, '工作日报.docx')
    console.log(res.data);
  } catch (error) {
    console.log(error);
    let localerror = error as AxiosError;
    errorMassage = localerror;
    //如果error内容为网络错误，那么就提示网络错误
    centerDialogVisible.value = true;
  }
}
let downloadUrl2 = 'http://localhost:8000/getDataList';//todo 在这里下载每日报表文件，别忘了最后修改成正式服务器地址
const downloaddata = async () => {
  let res;
  try {
    res = await axios.get(downloadUrl2,{params:{date:currentDate.value.toLocaleDateString('zh-cn')}});
    console.log(res.data);
    if(res.data.reporttime!=null){
      showtable.value=true;
      ElMessage({ message: '已生成' + currentDate.value.getDate()+ '日报表', type: 'success' });
      console.log(res.data);
      tableData.value[0]=res.data;
      console.log(tableData.value[0]);
      downloadFile();
    }
    else if(res.data[0]!=null){
      ElMessage({ message: '没有' + currentDate.value.getDate()+ '日报表数据', type: 'warning' })
    }
    else{
      console.log('错误');
    }
    btnLoading.value = false;
  } catch (error) {
    console.log(error);
    let localerror = error as AxiosError;
    errorMassage = localerror;
    //如果error内容为网络错误，那么就提示网络错误
    centerDialogVisible.value = true;
    btnLoading.value = false;
  }




}


</script>

<template>
  <!-- <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" class="logo" alt="Vite logo" />
            </a>
            <a href="https://vuejs.org/" target="_blank">
              <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
            </a>
          </div>
          <HelloWorld msg="Vite + Vue" /> -->
  <div style="text-align: center; padding-top: 5%;"><h1>欢迎使用每日报表生成网站(一期)</h1></div>

  <el-row type="flex" style="align-items: center;">
    <el-col>
      <div class="demo-date-picker">
        <div class="block">
          <span class="demonstration">请选择报表日期</span>
          <el-date-picker v-model="currentDate" type="date"  ></el-date-picker>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-button :loading="btnLoading" type="primary" @click="handleClick" >开始</el-button>
  </el-row>
  <el-row justify='center'>
    <el-table  v-if="showtable" :data="tableData"    border  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"   style="width: 60%;">
      <el-table-column prop="dailya" label="当日注册"  />
      <el-table-column prop="dailyp" label="当日检验" />
      <el-table-column prop="yeara" label="全年注册" />
      <el-table-column prop="dailydriver" label="当日驾驶员" />
      <el-table-column prop="yeardriver" label="全年驾驶员" />
      <el-table-column prop="reporttime" label="统计时间"  width="200"/>
      <el-table-column prop="bz" label="备注" />
    </el-table>
    <el-text type="primary" v-else>请点击开始查询数据</el-text>
  </el-row>
  <div class="footer"><el-text class='mx-1' size="small"><span>&copy;2023|此网站属车管所业务监督科</span><b>张硕</b><span>所有|如遇故障请联系13920148266|技术栈 FrontEnd:Vue3+TypeScript+ElementPlus+Vite BackEnd:Python+FastAPI Intelligence:GitHub Copilot|保留所有权利</span></el-text></div>


  <el-dialog v-model="centerDialogVisible" title="出现故障" width="30%" center>
    <div style="text-align:center">
      您的网络错误或此页面无法连接到后端服务器，请检查网络连接或联系管理员。
    </div>
    <el-divider />
    <div style="font-size: 6px">故障信息：config:{{ errorMassage.config }}------response:{{ errorMassage.response }}</div>
    <el-divider />
    <div style="text-align:center">对此带来的不便对您深表歉意。</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  text-align: center;
}
.header{

  top: 0;
  width: 100%;
  height: 30px;
  text-align: center;

}
</style>
