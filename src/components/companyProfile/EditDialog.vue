<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";

const props = defineProps({
  editDialog: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: Array,
    default: () => [],
  },
  regionList: {
    type: Array,
    default: () => [],
  },
  editType: {
    type: String,
    default: "add",
  },
  itemData: {
    type: Object,
    default: () => ({}),
  },
});
const valid = ref(false);
const editFormRef = ref(null);
const formData = reactive(props.itemData);
const showPassword = ref(false);
// 欄位檢核
const rules = ref({
  companyName: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入公司名稱";
  },
  receiptNo: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入統一編號";
  },
  undertakerName: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入負責人姓名";
  },
  phone: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入電話";
  },
  fax: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入傳真";
  },
  addr: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入地址";
  },
  isMail: (value) => {
    const hasValue = !!value && value.length > 0;
    return hasValue || "請輸入 e-mail";
  },
  contactEmail: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "請檢查 e-mail 格式是否正確";
  },
});

const showPasswordHandler = () => {
  showPassword.value = !showPassword.value;
};

const emit = defineEmits(["update:editDialog", "saveForm"]);

const saveFormHandler = () => {
  // 欄位有錯誤，檢核未過不能送出表單
  editFormRef.value.validate();
  if (!valid.value) return;

  // 送出表單
  emit("saveForm", formData);
};

const cancelHandler = () => {
  emit("update:editDialog", false);
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model.update="props.editDialog" persistent width="800">
      <v-card class="pa-3">
        <v-form
          ref="editFormRef"
          v-model="valid"
          @submit.prevent="saveFormHandler"
        >
          <v-card-title>
            <span class="text-h5 font-weight-bold">
              {{ editType === "add" ? "新增" : "編輯" }}公司資料</span
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
                    v-model="formData.receiptNo"
                    label="統一編號"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.receiptNo]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.undertakerName"
                    label="負責人"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.undertakerName]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.phone"
                    label="電話"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.phone]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.fax"
                    label="傳真"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.fax]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.contactEmail"
                    label="Email"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.isMail, rules.contactEmail]"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.addr"
                    label="地址"
                    density="compact"
                    variant="outlined"
                    :rules="[rules.addr]"
                    hide-details="auto"
                    required
                  ></v-text-field>
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
