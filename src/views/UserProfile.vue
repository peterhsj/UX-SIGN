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

// E-mail 欄位檢核
const rules = ref({
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !value || pattern.test(value) || "請檢查 e-mail 格式是否正確";
  },
});

const form = reactive({
  companyName: null,
  pid: null,
  userName: null,
  email: null,
  RoleID: null,
});
const headers = reactive([
  {
    title: "Dessert (100g serving)",
    align: "start",
    sortable: false,
    key: "name",
  },
  { title: "Calories", key: "calories", align: "end" },
  { title: "Fat (g)", key: "fat", align: "end" },
  { title: "Carbs (g)", key: "carbs", align: "end" },
  { title: "Protein (g)", key: "protein", align: "end" },
  { title: "Iron (%)", key: "iron", align: "end" },
]);
const desserts = reactive([
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: "1",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: "0",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: "6",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: "7",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: "16",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: "1",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: "2",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: "8",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: "45",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: "22",
  },
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: "1",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: "0",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: "6",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: "7",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: "16",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: "1",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: "2",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: "8",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: "45",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: "22",
  },
]);

// 查詢表單
const queryHandler = () => {
  // 欄位有錯誤，檢覈未過不能送出表單
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

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  loading.value = true;
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

const addUser = () => {
  console.log("add");
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
                <v-text-field
                  v-model="form.companyName"
                  :counter="10"
                  label="隸屬公司"
                  density="compact"
                  variant="outlined"
                  color="blue-lighten-1"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.pid"
                  :counter="10"
                  label="用戶帳號"
                  density="compact"
                  variant="outlined"
                  color="blue-lighten-1"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.userName"
                  :counter="10"
                  label="姓名"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  :rules="[rules.email]"
                  type="mail"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="form.RoleID"
                  label="角色"
                  :items="[
                    { title: '一般使用者', value: '1' },
                    { title: '帳號管理員', value: '0' },
                  ]"
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-card>
      <div class="my-4 d-flex justify-space-between align-center">
        <div>
          <v-tooltip text="新增使用者" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-plus"
                size="small"
                color="green-darken-1"
                @click="addUser"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
        <div>
          <v-btn class="me-4" color="grey text-white" @click="handleReset">
            重設
          </v-btn>
          <v-btn type="submit" color="blue-darken-2"> 查詢 </v-btn>
        </div>
      </div>
    </v-form>
    <EditDialog></EditDialog>

    <h1 class="my-3 text-h5 font-weight-bold">使用者列表</h1>
    <v-card border>
      <v-data-table-server
        v-model:page="page"
        :loading="loading"
        :headers="headers"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :items="serverItems"
        class="elevation-1"
        item-value="name"
        hide-default-footer
        fixed-header
        hover
        @update:options="loadItems"
      ></v-data-table-server>
    </v-card>

    <v-card class="mt-2" flat>
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
</style>
