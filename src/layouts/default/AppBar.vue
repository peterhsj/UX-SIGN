<template>
  <v-app-bar flat color="blue-lighten-3">
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-6" />
    </v-app-bar-title>
    <v-btn size="large" to="/" class="mx-2 text-h6 font-weight-bold text-blue-grey-darken-3">
      合約
    </v-btn>
    <v-btn size="large" to="/History" class="mx-2 text-h6 font-weight-bold text-blue-grey-darken-3">
      查詢
    </v-btn>
    <v-spacer></v-spacer>
    <div class="mr-4 font-weight-bold text-blue-grey-darken-3">
      測試公司 林大明 您好
    </div>

    <v-btn id="menu-activator" color="primary" icon="mdi-account"></v-btn>
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item to="/UserProfile">
          <v-list-item-title>使用者管理</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/CompanyProfile">
          <v-list-item-title>公司管理</v-list-item-title>
        </v-list-item>
        <v-list-item to="/Seal">
          <v-list-item-title>印鑑管理</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/Logout">
          <v-list-item-title>登出</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/Sample">
          <v-list-item-title>範例</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";
const items = ref([
  { title: "使用者管理" },
  { title: "公司管理" },
  { title: "印鑑管理" },
  { title: "登出" },
]);
</script>
