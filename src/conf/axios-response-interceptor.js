/**
* 攔截每個 AJAX HTTP Response 進行處理
* @param {*} response
*/

const handleResponse = response => {
  // 在這裡加入您的邏輯
  return response;
};

/**
* 攔截每個 AJAX HTTP Response Error 進行處理
* @param {*} error
*/
const handleResponseError = error => {
  // 在這裡加入您的邏輯
  return Promise.reject(error);
};

export { handleResponse, handleResponseError };