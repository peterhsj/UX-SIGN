<script setup>
/**
 * @param {string} uuid - uuid
 * @param {string} companyId - 公司代碼
 * @param {string} url - 圖片 URL
 * @param {string} type - 圖片類型 (st: 圖章, si: fu0 簽名)
 */
const fakeSealList = [
  {
    uuid: "1",
    companyId: "01",
    url: "https://picsum.photos/500/300?random=1",
    type: "st",
  },
  {
    uuid: "2",
    companyId: "02",
    url: "https://picsum.photos/500/300?random=2",
    type: "st",
  },
  {
    uuid: "3",
    companyId: "03",
    url: "https://picsum.photos/500/300?random=3",
    type: "st",
  },
  {
    uuid: "4",
    companyId: "04",
    url: "https://picsum.photos/500/300?random=4",
    type: "si",
  },
  {
    uuid: "5",
    companyId: "05",
    url: "https://picsum.photos/500/300?random=5",
    type: "st",
  },
  {
    uuid: "6",
    companyId: "06",
    url: "https://picsum.photos/500/300?random=6",
    type: "si",
  },
  {
    uuid: "7",
    companyId: "07",
    url: "https://picsum.photos/300/600?random=7",
    type: "st",
  },
];
import SmoothSignature from "smooth-signature";
import InfoDialog from "@/components/InfoDialog.vue";
import { ref, reactive, onMounted } from "vue";

const fileReader = new FileReader();
const tab = ref(null);
const sealImage = ref(null);
const sealList = reactive(fakeSealList);
const currentColor = ref("black");
let itemData = reactive({});
let imgData = reactive({});
const infoDialog = ref(false);
const previewImg = ref(null);

// 新增圖檔
const addSealHandler = (imgData) => {
  console.log("imgData:", imgData);
};

// 轉換上傳圖檔
const transferImage = async () => {
  // 取得上傳欄位資料
  const imageSource = sealImage.value[0];
  const imageTitle =
    // 將上傳欄位資料存放在 imgData
    (imgData = Object.assign(imgData, {
      name: imageSource.name.split(".")[0],
      type: imageSource.type,
      size: bytesToMegaBytes(imageSource.size, 4),
    }));

  // 將檔案轉成 Base64 格式
  await getImageToBase64(imageSource);
};

/** 新增 img url 為 Base64 格式 */
const getImageToBase64 = async (imageSource) => {
  // 將 File Object 讀取成 DataURL
  fileReader.readAsDataURL(imageSource);
  // load 時可以取得 fileReader 回傳的結果
  fileReader.onload = async () => {
    let dataURL = fileReader.result; // Base64 Image

    // 如果是 jpeg 檔案就轉換成 png
    if (imgData.type === "image/jpeg") {
      dataURL = await jpeg2png(dataURL);
    }
    // 寫入 imgData
    const imgTransferData = {
      url: dataURL,
      type: "image/png",
      size: await calSize(dataURL), // 取得轉檔後的檔案大小
    };
    imgData = Object.assign(imgData, imgTransferData);
    addSealHandler(imgData);

    // 預覽圖
    previewImg.value = dataURL;
  };
};

/** 將 input 預設的 bytes 轉為 Kb */
const bytesToMegaBytes = (bytes, digits) => {
  return digits ? (bytes / 1024).toFixed(digits) : bytes / 1024;
};

/** 取得 base64圖片大小，返回 Kb */
const calSize = (base64url) => {
  let str = base64url.replace("data:image/png;base64,", "");
  const equalIndex = str.indexOf("=");
  if (str.indexOf("=") > 0) {
    str = str.substring(0, equalIndex);
  }
  const strLength = str.length;
  const fileLength = strLength - (strLength / 8) * 2;
  // 返回單位為Kb的大小
  return (fileLength / 1024).toFixed(2);
};

// jpeg 轉換 png
const jpeg2png = (base64jpeg) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("src", base64jpeg);
    img.setAttribute("crossOrigin", "anoymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
  });
};

// 開啟確認視窗
const openDeleteSeal = (item) => {
  console.log("seal:", item.uuid);
  infoDialog.value = true;
};

// 刪除圖檔
const delSealHandler = (event) => {
  console.log("event:", event);
};

// 使用簽名模組
const setSignaturePad = () => {
  setTimeout(() => {
    signatureInit();
  }, 500);
};

// 選取顏色
const changeColor = (color) => {
  currentColor.value = color;
  signature.color =
    currentColor.value === "blue"
      ? "#1565C0"
      : currentColor.value === "red"
      ? "#E53935"
      : "#000000";
};

let signature = {};
// 簽名板初始化
const signatureInit = () => {
  const signatureCanvas = document.querySelector("#signatureCanvas");
  let signatureWidth = signatureCanvas.offsetWidth;
  const canvas = document.querySelector("canvas");
  const options = {
    width: signatureWidth - 26,
    height: 200,
    scale: 2,
    minWidth: 4,
    maxWidth: 10,
    color: "#000000",
    bgColor: "#efefef",
  };
  // SmoothSignature Canvas 畫面生成
  signature = new SmoothSignature(canvas, options);
};

// 清除簽名
const clearSignature = () => {
  signature.clear();
};

// 儲存簽名
const saveSignature = () => {
  const isEmpty = signature.isEmpty();
  if (isEmpty) {
    alert("isEmpty");
    return;
  }
  const pngUrl = signature.getPNG();
  addSignature(pngUrl);
};
// 寫入API
const addSignature = (pngUrl) => {
  // console.log(typeof pngUrl);
  itemData = Object.assign(itemData, { pngUrl });
  console.log("itemData:", itemData);
};
</script>
<template>
  <v-container id="Signature">
    <v-card elevation="3" border class="ma-5 py-5">
      <v-tabs v-model="tab" color="primary" align-tabs="center">
        <v-tab :value="1" class="text-h6 font-weight-bold">印鑑圖檔</v-tab>
        <v-tab
          :value="2"
          @click="setSignaturePad"
          class="text-h6 font-weight-bold"
          >使用簽名</v-tab
        >
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <!-- 印鑑圖檔 -->
          <v-window-item :value="1">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(seal, i) in sealList"
                  :key="i"
                  cols="12"
                  md="3"
                  lg="2"
                >
                  <v-card
                    border
                    class="pa-3 d-flex align-center justify-center"
                    height="200"
                  >
                    <img :src="seal.url" class="stamp__image" />
                    <div class="stamp__options">
                      <!-- 刪除圖檔-->
                      <v-tooltip text="刪除" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            elevation="3"
                            density="comfortable"
                            icon="mdi-trash-can-outline"
                            size="small"
                            color="red-lighten-1"
                            class="btn__icon"
                            @click="openDeleteSeal(seal)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                      <!-- 套用圖檔-->
                      <v-tooltip text="套用" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            elevation="3"
                            density="comfortable"
                            icon="mdi-check-bold"
                            size="small"
                            color="green-darken-1"
                            class="btn__icon"
                            @click="selectHandler(seal)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                  </v-card>
                </v-col>
                <!-- 新增圖檔 -->
                <v-col cols="12" md="3" lg="2">
                  <label for="sealImage">
                    <v-card
                      border
                      class="pa-3 d-flex flex-column align-center justify-center h-100"
                      link
                    >
                      <v-icon
                        icon="mdi-image-plus"
                        color="green-darken-1"
                        size="40"
                      ></v-icon>
                      <span
                        class="pt-1 text-subtitle-1 font-weight-bold text-green-darken-3"
                      >
                        新增印鑑檔
                      </span>
                      <span class="pt-1 text-subtitle-2 green-darken-1">
                        支援 jpg、png 格式
                      </span>
                      <v-file-input
                        v-model="sealImage"
                        id="sealImage"
                        accept="image/*"
                        style="display: none"
                        hide-details
                        density="compact"
                        multiple
                        @change="transferImage"
                      />
                    </v-card>
                  </label>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <!-- 使用簽名 -->
          <v-window-item :value="2">
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-card
                    border
                    id="signatureCanvas"
                    class="px-3 pt-3 pb-1 mx-auto"
                    style="max-width: 600px"
                  >
                    <canvas></canvas>
                  </v-card>
                  <div
                    class="mx-auto d-flex justify-space-between pt-3"
                    style="max-width: 600px"
                  >
                    <div>
                      <v-btn
                        class="mr-3 bg-grey text-white"
                        @click="clearSignature"
                      >
                        清除
                      </v-btn>
                      <v-btn
                        icon
                        elevation="3"
                        color="grey-darken-4"
                        density="compact"
                        class="mx-2 btn__icon"
                        :class="{
                          'btn__icon--actived': currentColor === 'black',
                        }"
                        @click="changeColor('black')"
                      ></v-btn>
                      <v-btn
                        icon
                        elevation="3"
                        color="blue-darken-3"
                        density="compact"
                        class="mx-2 btn__icon"
                        :class="{
                          'btn__icon--actived': currentColor === 'blue',
                        }"
                        @click="changeColor('blue')"
                      ></v-btn>
                      <v-btn
                        icon
                        elevation="3"
                        color="red-darken-1"
                        density="compact"
                        class="mx-2 btn__icon"
                        :class="{
                          'btn__icon--actived': currentColor === 'red',
                        }"
                        @click="changeColor('red')"
                      ></v-btn>
                    </div>
                    <v-btn class="bg-blue-darken-2" @click="saveSignature">
                      儲存
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  v-for="(seal, i) in sealList"
                  :key="i"
                  cols="12"
                  md="3"
                  lg="2"
                >
                  <v-card
                    border
                    class="pa-3 d-flex align-center justify-center"
                    height="200"
                  >
                    <img :src="seal.url" class="stamp__image" />
                    <div class="stamp__options">
                      <!-- 刪除圖檔-->
                      <v-tooltip text="刪除" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            elevation="3"
                            density="comfortable"
                            icon="mdi-trash-can-outline"
                            size="small"
                            color="red-lighten-1"
                            class="btn__icon"
                            @click="openDeleteSeal(seal)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                      <!-- 套用圖檔-->
                      <v-tooltip text="套用" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            elevation="3"
                            density="comfortable"
                            icon="mdi-check-bold"
                            size="small"
                            color="green-darken-1"
                            class="btn__icon"
                            @click="selectHandler(seal)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="3" style="height: 200px">
        <label for="sealImage">
          <v-card
            border
            class="pa-3 d-flex flex-column align-center justify-center h-100"
          >
            <img :src="previewImg" class="stamp__image" />
          </v-card>
        </label>
      </v-col>
    </v-row>
  </v-container>
  <!-- 確認對話視窗 -->
  <InfoDialog
    v-model:infoDialog="infoDialog"
    :itemData="itemData"
    @isConfirm="delSealHandler"
  >
    <template v-slot:content>
      <div>
        <v-icon size="100" color="deep-orange-lighten-1" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>
      </div>
      <span class="text-h5 font-weight-bold"> 確認刪除印鑑章 ? </span>
    </template>
  </InfoDialog>
</template>
<style lang="scss" scoped>
.delIcon {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.btn {
  &__icon {
    border: 1px solid #fff;
    &--actived {
      border-width: 4px;
      border-style: double;
      border-color: #fff;
    }
  }
}
.stamp {
  &__image {
    max-width: 100%;
    max-height: 100%;
  }
  &__options {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
