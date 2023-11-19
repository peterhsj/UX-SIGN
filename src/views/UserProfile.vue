<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import EditDialog from "@/components/userProfile/EditDialog.vue";

const valid = ref(false);
const searchForm = ref(null);
const loading = ref(true);
const page = ref(1);
const itemsPerPage = ref(5);
const serverItems = ref([]);
const totalItems = ref(0);

const editDialog = ref(false);
const editType = ref("");
// 初始化編輯表單
const initForm = reactive({
  uuid: null,
  companyName: null,
  pid: null,
  userName: null,
  passWord: null,
  eMail: null,
  roleId: null,
  region: null,
});
let itemData = reactive({});

// E-mail 欄位檢核
const rules = ref({
  eMail: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !value || pattern.test(value) || "請檢查 e-mail 格式是否正確";
  },
});

const form = reactive({
  companyName: null,
  pid: null,
  userName: null,
  eMail: null,
  roleId: null,
});
const headers = reactive([
  {
    title: "公司名稱",
    align: "start",
    sortable: false,
    key: "companyName",
  },
  { title: "用戶帳號", key: "pid", align: "start" },
  { title: "姓名", key: "userName", align: "start" },
  { title: "E-mail", key: "eMail", align: "start" },
  { title: "權限", key: "roleId", align: "start" },
  { title: "憑證類型", key: "region", align: "start" },
  { title: "", key: "Action", align: "center" },
]);
const desserts = reactive([
  {
    uuid: "01",
    companyName: "系統管理員",
    pid: "ifsadmin",
    userName: "System Admin",
    passWord: '231356465',
    eMail: "invoice_test@uxb2b.com",
    roleId: "0",
    region: null,
  },
  {
    uuid: "02",
    companyName: "網際優勢甲方公司",
    pid: "UserA",
    userName: "UserA",
    passWord: null,
    eMail: "chris@uxb2b.com",
    roleId: "1",
    region: "O",
  },
  {
    uuid: "03",
    companyName: "網際優勢乙方公司",
    pid: "UserB",
    userName: "UserB",
    passWord: null,
    eMail: "rsung@uxb2b.com",
    roleId: "2",
    region: "O",
  },
]);

// 權限列表
const roles = [
  { title: "一般使用者", value: "1" },
  { title: "帳號管理員", value: "2" },
  { title: "系統管理員", value: "0" },
];
// 憑證類型
const regionList = [
  { title: "工商憑證", value: "O" },
  { title: "自然人憑證", value: "P" },
  { title: "企業憑證", value: "E" },
];

// 查詢表單
const queryHandler = () => {
  // 欄位有錯誤，檢核未過不能送出表單
  searchForm.value.validate();
  if (!valid.value) return;

  // 送出表單
  console.log("form:", form);
};

// 重設查詢表單
const handleReset = () => {
  searchForm.value.reset();
};

// 查詢表單API
const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = desserts.slice();

        if (sortBy.length) {
          const sortKey = sortBy[0].key;
          const sortOrder = sortBy[0].order;
          items.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
          });
        }

        const paginated = items.slice(start, end);

        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
};

// 列表選項變更時重新查詢
const loadItems = ({ page, itemsPerPage, sortBy }) => {
  loading.value = true;
  console.log({ page, itemsPerPage, sortBy });
  FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;
  });
};

// 計算總分頁
const pageCount = computed(() => {
  return Math.ceil(desserts.length / itemsPerPage.value);
});

// 新增使用者
const addUser = (type) => {
  editType.value = type;
  itemData = Object.assign(itemData, initForm);
  editDialog.value = true;
};

// 編輯使用者
const editUser = (type, item) => {
  editType.value = type;
  itemData = Object.assign(itemData, item);
  editDialog.value = true;
};

// 權限參數轉換文字
const roleTextTransform = (value) => {
  const roleData = roles.filter((item) => item.value === value);
  return roleData.length > 0 ? roleData[0].title : null;
};

// 憑證類型參數轉換文字
const regionTextTransform = (value) => {
  const regionData = regionList.filter((item) => item.value === value);
  return regionData.length > 0 ? regionData[0].title : null;
};

onMounted(() => {
  // 載入表單資料
  const payload = {
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
  };
  loadItems(payload);
});
</script>

<template>
  <v-container id="UserProfile">
    <h1 class="my-3 text-h5 font-weight-bold">使用者基本資料維護</h1>
    <v-form ref="searchForm" v-model="valid" @submit.prevent="queryHandler">
      <v-card border class="pa-4">
        <v-row>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="form.companyName" :counter="10" label="公司名稱" density="compact" variant="outlined"
                  color="blue-lighten-1" hide-details></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.pid" :counter="10" label="用戶帳號" density="compact" variant="outlined"
                  color="blue-lighten-1" hide-details></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.userName" :counter="10" label="姓名" variant="outlined" color="blue-lighten-1"
                  density="compact" hide-details></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.eMail" label="E-mail" :rules="[rules.eMail]" type="mail" variant="outlined"
                  color="blue-lighten-1" density="compact" hide-details="auto"></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select v-model="form.roleId" label="權限" :items="roles" variant="outlined" color="blue-lighten-1"
                  density="compact" hide-details></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-card>
      <p>{{ itemData || {} }}</p>
      <p>{{ editType }}</p>
      <div class="my-4 d-flex justify-space-between align-center">
        <div>
          <v-tooltip text="新增使用者" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-plus" size="small" color="green-darken-1" @click="addUser('add')"></v-btn>
            </template>
          </v-tooltip>
        </div>
        <div>
          <v-btn class="me-4 bg-grey text-white" @click="handleReset">
            重設
          </v-btn>
          <v-btn type="submit" class="bg-blue-darken-2"> 查詢 </v-btn>
        </div>
      </div>
    </v-form>

    <h1 class="my-3 text-h5 font-weight-bold">使用者列表</h1>
    <v-card border>
      <v-data-table-server v-if="totalItems > 0" :loading="loading" :headers="headers" :items-length="totalItems"
        :items-per-page="itemsPerPage" :items="serverItems" loading-text="資料查詢中... 請稍後" no-data-text="查無資料"
        class="elevation-1 uxSign--table" item-value="name" hide-default-footer fixed-header color="red" hover
        @update:options="loadItems">
        <!-- 權限欄位 -->
        <template v-slot:item.roleId="{ item }">
          {{ roleTextTransform(item.roleId) }}
        </template>
        <!-- 憑證類型欄位 -->
        <template v-slot:item.region="{ item }">
          {{ regionTextTransform(item.region) }}
        </template>
        <!-- 操作欄位 -->
        <template v-slot:item.Action="{ item }">
          <!-- 編輯 -->
          <v-tooltip text="編輯" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-note-edit-outline" size="x-small" color="blue-darken-1" class="mx-1"
                @click="editUser('edit', item)"></v-btn>
            </template>
          </v-tooltip>
          <!-- 刪除 -->
          <v-tooltip text="刪除" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-trash-can-outline" size="x-small" color="red-lighten-1" class="mx-1"
                @click="deleteUser(item)"></v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
      <div v-else class="pa-5 d-flex flex-column align-center justify-center">
        <v-icon size="70" color="orange-darken-2" aria-hidden="false">
          mdi-alert-circle-outline
        </v-icon>
        <span class="py-2 text-h6 font-weight-bold">查無資料</span>
      </div>
    </v-card>

    <!-- 分頁模組 -->
    <v-card v-if="totalItems > 0" class="mt-2" flat>
      <v-row class="ma-0 d-flex align-center justify-space-between">
        <v-col>
          <v-pagination v-model="page" :length="pageCount" density="compact" rounded="circle"></v-pagination>
        </v-col>

        <v-col class="d-flex align-center">
          <v-spacer></v-spacer>
          <div class="text-subtitle-1 text-medium-emphasis pe-4">
            第 {{ page }} / {{ pageCount }} 頁， 共 {{ totalItems }} 筆
          </div>
          <div class="text-subtitle-1 text-medium-emphasis">每頁筆數：</div>
          <div style="width: 110px">
            <v-select :items="[5, 10, 20, 50, 100]" :model-value="itemsPerPage" :total-visible="7" class="pa-2"
              density="compact" variant="outlined" hide-details
              @update:model-value="itemsPerPage = parseInt($event, 10)"></v-select>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- 編輯視窗 -->
  <EditDialog v-model:editDialog="editDialog" :roles="roles" :regionList="regionList" :editType="editType"
    :itemData="itemData"></EditDialog>
</template>

<style lang="scss" scoped>
@media (min-width: 2560px) {
  .v-container {
    max-width: 1800px;
  }
}

:deep(.v-table__wrapper) {
  max-height: calc(100vh - 515px);
  min-height: 300px;
}

:deep(.v-data-table-footer) {
  display: none;
}

:deep(.v-table.v-table--fixed-header.uxSign--table > .v-table__wrapper > table > thead > tr > th) {
  background-color: #ffe0b2 !important;
  font-weight: bolder;
}
</style>
