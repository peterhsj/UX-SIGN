<template>
  <v-container class="about">
    <h1 class="my-3 text-h5 font-weight-bold">使用者基本資料維護</h1>
    <v-form v-model="valid" @submit.prevent="queryHandler">
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
                  variant="outlined"
                  color="blue-lighten-1"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.RoleID"
                  label="角色"
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
      <div class="my-4 d-flex">
        <v-spacer></v-spacer>
        <v-btn class="me-4" color="grey text-white" @click="handleReset">
          重設
        </v-btn>
        <v-btn type="submit" color="blue-darken-2"> 查詢 </v-btn>
      </div>
    </v-form>

    <h1 class="my-3 text-h5 font-weight-bold">使用者列表</h1>
    <v-card border class="pa-4">
      <v-data-table-server
        v-model:itemsPerPage="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        class="elevation-1"
        item-value="name"
        @update:options="loadItems"
      ></v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 查詢表單
const valid = ref(false);
const form = ref({
  companyName: null,
  pid: null,
  userName: null,
  email: null,
  RoleID: null,
});

function queryHandler() {
  console.log("form:", form);
}

function handleReset() {
  console.log("handleReset");
}

// 顯示表單
const desserts = [
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
];

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

const itemsPerPage = ref(5);
const headers = ref([
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
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true;
  FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;
  });
}

onMounted(() => {
  loadItems();
});
</script>

<style></style>
