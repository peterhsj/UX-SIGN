<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  editDialog: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: Object,
    default: () => [],
  },
  regionList: {
    type: Object,
    default: () => [],
  },
  editType: {
    type: String,
    default: "add",
  },
  itemData: {
    type: Object,
    default: () => [],
  },
});
const valid = ref(false);
const editForm = ref(null);
const initForm = ref({
  uuid: null,
  companyName: null,
  pid: null,
  userName: null,
  passWord: null,
  eMail: null,
  roleId: null,
  region: null,
});
const formData = ref({});
// 欄位檢核
const rules = ref({
  companyName: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入公司名稱";
  },
  userName: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入姓名";
  },
  pid: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入帳號";
  },
  password: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入密碼";
  },
  isMail: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入 e-mail";
  },
  eMail: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "請檢查 e-mail 格式是否正確";
  },
  roleId: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請選擇權限設定";
  },
  region: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請選擇憑證類型";
  },
});

const emit = defineEmits(["update:editDialog"]);

onMounted(() => {
  formData.value = { ...initForm.value };
  if (props.editType === "edit") {
    console.log("edit1");
  }
});

const saveFormHandler = () => {
  // 欄位有錯誤，檢核未過不能送出表單
  editForm.value.validate();
  if (!valid.value) return;

  // 送出表單
  console.log("formData:", formData.value);
};

const cancelHandler = () => {
  formData.value = { ...initForm.value };
  emit("update:editDialog", false);
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model.update="props.editDialog" persistent width="800">
      <v-card class="pa-3">
        <v-form
          ref="editForm"
          v-model="valid"
          @submit.prevent="saveFormHandler"
        >
          <v-card-title>
            <span class="text-h5 font-weight-bold">
              {{ editType === "add" ? "新增" : "編輯" }}使用者資料</span
            >
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.companyName"
                    label="公司名稱"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.companyName]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.userName"
                    label="姓名"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.userName]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.pid"
                    label="用戶帳號"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.pid]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.passWord"
                    label="密碼"
                    type="password"
                    density="compact"
                    variant="outlined"
                    autocomplete="off"
                    :autofocus="false"
                    :rules="[rules.password]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.eMail"
                    label="Email"
                    density="compact"
                    variant="outlined"
                    autocomplete="off"
                    :rules="[rules.isMail, rules.eMail]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.roleId"
                    :items="roles"
                    label="權限設定"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.roleId]"
                    hide-details="auto"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.region"
                    :items="regionList"
                    label="憑證類型"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.region]"
                    hide-details="auto"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="me-4 bg-grey text-white" @click="cancelHandler">
              取消
            </v-btn>
            <v-btn type="submit" class="bg-blue-darken-2"> 儲存 </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<style></style>
