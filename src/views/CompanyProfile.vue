<script setup>
import EditDialog from "@/components/companyProfile/EditDialog.vue";
import InfoDialog from "@/components/InfoDialog.vue";
import { ref, reactive, onMounted, computed, watch } from "vue";

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
  receiptNo: null,
  phone: null,
  fax: null,
  undertakerName: null,
  eMail: null,
  addr: null,
});
let itemData = reactive({});

const infoDialog = ref(false);

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
  receiptNo: null,
  phone: null,
  fax: null,
  undertakerName: null,
  eMail: null,
  addr: null,
});
const headers = reactive([
  { title: "公司名稱", key: "companyName", align: "start", sortable: false },
  { title: "統一編號", key: "receiptNo", align: "start" },
  { title: "負責人", key: "undertakerName", align: "start" },
  { title: "電話", key: "phone", align: "start" },
  { title: "傳真", key: "fax", align: "start" },
  { title: "地址", key: "addr", align: "start" },
  { title: "電子郵件", key: "contactEmail", align: "start" },
  { title: "", key: "Action", align: "center" },
]);
// 公司列表
const desserts = reactive([
  {
    uuid: "111",
    companyName: "網際優勢甲方公司",
    receiptNo: "12345678",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區南海路20號6樓",
    contactEmail: "David@uxb2b.com",
    undertakerName: "劉大衛",
  },
  {
    uuid: "222",
    companyName: "網際優勢乙方公司",
    receiptNo: "87654321",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區杭州南路120號8樓",
    contactEmail: "wang@uxb2b.com",
    undertakerName: "王大衛",
  },
  {
    uuid: "333",
    companyName: "網際優勢丙方公司",
    receiptNo: "85214788",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區羅斯福路200號6樓之一",
    contactEmail: "lin@uxb2b.com",
    undertakerName: "林大衛",
  },
  {
    uuid: "222",
    companyName: "網際優勢乙方公司",
    receiptNo: "87654321",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區杭州南路120號8樓",
    contactEmail: "wang@uxb2b.com",
    undertakerName: "王大衛",
  },
  {
    uuid: "333",
    companyName: "網際優勢丙方公司",
    receiptNo: "85214788",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區羅斯福路200號6樓之一",
    contactEmail: "lin@uxb2b.com",
    undertakerName: "林大衛",
  },
  {
    uuid: "222",
    companyName: "網際優勢乙方公司",
    receiptNo: "87654321",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區杭州南路120號8樓",
    contactEmail: "wang@uxb2b.com",
    undertakerName: "王大衛",
  },
  {
    uuid: "333",
    companyName: "網際優勢丙方公司",
    receiptNo: "85214788",
    phone: "02-12345678",
    fax: "02-12345679",
    addr: "台北市中正區羅斯福路200號6樓之一",
    contactEmail: "lin@uxb2b.com",
    undertakerName: "林大衛",
  },
]);

// 查詢表單
const queryHandler = () => {
  // 欄位有錯誤，檢核未過不能送出表單
  searchForm.value.validate();
  if (!valid.value) return;

  // 送出表單
  loading.value = true;
  const payload = {
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
    data: form,
  };
  loadItems(payload);
};

// 重設查詢表單
const handleReset = () => {
  searchForm.value.reset();
};

// 列表選項變更時重新查詢
const loadItems = (payload) => {
  loading.value = true;
  console.log("payload:", payload);
  FakeAPI.fetch({ ...payload }).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;
  });
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

// 計算總分頁
const pageCount = computed(() => {
  return Math.ceil(desserts.length / itemsPerPage.value);
});

// 新增使用者
const addCompany = (type) => {
  editType.value = type;
  itemData = Object.assign(itemData, initForm);
  editDialog.value = true;
};

// 編輯使用者
const editCompany = (type, item) => {
  editType.value = type;
  itemData = Object.assign(itemData, item);
  editDialog.value = true;
};

// 儲存使用者資訊
const saveForm = (data) => {
  if (data) {
    editDialog.value = false;
  }

  const payload = {
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: [],
    data: data,
  };
  loadItems(payload);
};

// 刪除使用者資訊
const deleteCompany = (item) => {
  itemData = Object.assign(itemData, item);
  infoDialog.value = true;
};

const confirmDelete = (data) => {
  if (data) {
    infoDialog.value = false;

    const payload = {
      page: 1,
      itemsPerPage: itemsPerPage.value,
      sortBy: [],
      data: data,
    };
    loadItems(payload);
  }
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
  <v-container id="CompanyProfile">
    <h1 class="my-3 text-h5 font-weight-bold">公司資料維護</h1>
    <v-form ref="searchForm" v-model="valid" @submit.prevent="queryHandler">
      <v-card border class="pa-4">
        <v-row>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.companyName"
                  :counter="10"
                  label="公司名稱"
                  density="compact"
                  variant="outlined"
                  color="blue-lighten-1"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.receiptNo"
                  :counter="10"
                  label="統一編號"
                  density="compact"
                  variant="outlined"
                  color="blue-lighten-1"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.phone"
                  :counter="10"
                  label="電話"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.fax"
                  :counter="10"
                  label="傳真"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.undertakerName"
                  :counter="10"
                  label="負責人"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.contactEmail"
                  label="E-mail"
                  :rules="[rules.eMail]"
                  type="mail"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.addr"
                  label="地址"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-card>
      <div class="my-4 d-flex justify-space-between align-center">
        <div>
          <v-tooltip text="新增公司資料" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-plus"
                size="small"
                color="green-darken-1"
                @click="addCompany('add')"
              ></v-btn>
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

    <h1 class="my-3 text-h5 font-weight-bold">公司列表</h1>
    <v-card border>
      <v-data-table-server
        v-if="totalItems > 0"
        v-model:page="page"
        :loading="loading"
        :headers="headers"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :items="serverItems"
        loading-text="資料查詢中... 請稍後"
        no-data-text="查無資料"
        class="elevation-1 uxSign--table"
        item-value="name"
        hide-default-footer
        fixed-header
        color="red"
        hover
        @update:options="loadItems"
      >
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
          <v-tooltip v-if="item.roleId !== '0'" text="編輯" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-note-edit-outline"
                size="x-small"
                color="blue-darken-1"
                class="ma-1"
                @click="editCompany('edit', item)"
              ></v-btn>
            </template>
          </v-tooltip>
          <!-- 刪除 -->
          <v-tooltip v-if="item.roleId !== '0'" text="刪除" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-trash-can-outline"
                size="x-small"
                color="red-lighten-1"
                class="ma-1"
                @click="deleteCompany(item)"
              ></v-btn>
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
          <v-pagination
            v-model="page"
            :length="pageCount"
            density="compact"
            rounded="circle"
          ></v-pagination>
        </v-col>

        <v-col class="d-flex align-center">
          <v-spacer></v-spacer>
          <div class="text-subtitle-1 text-medium-emphasis pe-4">
            第 {{ page }} / {{ pageCount }} 頁， 共 {{ totalItems }} 筆
          </div>
          <div class="text-subtitle-1 text-medium-emphasis">每頁筆數：</div>
          <div style="width: 110px">
            <v-select
              :items="[5, 10, 20, 50, 100]"
              :model-value="itemsPerPage"
              :total-visible="7"
              class="pa-2"
              density="compact"
              variant="outlined"
              hide-details
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            ></v-select>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- 編輯視窗 -->
  <EditDialog
    v-model:editDialog="editDialog"
    :editType="editType"
    :itemData="itemData"
    @save-form="saveForm"
  ></EditDialog>

  <!-- 確認對話視窗 -->
  <InfoDialog
    v-model:infoDialog="infoDialog"
    :itemData="itemData"
    @isConfirm="confirmDelete"
  >
    <template v-slot:content>
      <div>
        <v-icon size="100" color="deep-orange-lighten-1" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>
      </div>
      <span class="text-h5 font-weight-bold">
        確認刪除公司
        <span class="text-blue-darken-1">{{ itemData.companyName }}</span>
        ?
      </span>
    </template>
  </InfoDialog>
</template>

<style lang="scss" scoped>
@media (min-width: 2560px) {
  .v-container {
    max-width: 1800px;
  }
}

:deep(.v-table__wrapper) {
  max-height: calc(100vh - 585px);
  min-height: 300px;
}

:deep(.v-data-table-footer) {
  display: none;
}

:deep(
    .v-table.v-table--fixed-header.uxSign--table
      > .v-table__wrapper
      > table
      > thead
      > tr
      > th
  ) {
  background-color: #ffe0b2 !important;
  font-weight: bolder;
}
</style>
