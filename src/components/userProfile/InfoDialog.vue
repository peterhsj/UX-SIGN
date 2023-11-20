<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";

const props = defineProps({
  infoDialog: {
    type: Boolean,
    default: false,
  },
  itemData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:infoDialog", "isConfirm"]);
const confirmHandler = () => {
  // 送出確認
  emit("isConfirm", props.itemData);
};

// 關閉視窗
const cancelHandler = () => {
  emit("update:infoDialog", false);
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model.update="props.infoDialog" persistent width="600">
      <v-card class="pa-3">
        <v-card-title>
          <span class="text-h5 font-weight-bold"></span>
        </v-card-title>
        <v-card-text class="text-center py-5">
          <div>
            <v-icon size="100" color="deep-orange-lighten-1" class="mb-4"
              >mdi-alert-circle-outline</v-icon
            >
          </div>
          <span class="text-h5 font-weight-bold">
            確認刪除使用者
            <span class="text-blue-darken-1">{{
              props.itemData.userName
            }}</span>
            ?
          </span>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn class="me-4 bg-grey text-white" @click="cancelHandler">
            取消
          </v-btn>
          <v-btn class="bg-blue-darken-2" @click="confirmHandler"> 確認 </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<style></style>
