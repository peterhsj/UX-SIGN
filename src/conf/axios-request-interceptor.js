/**
  * 攔截每個 AJAX HTTP Request 進行處理
  * @param {*} config
*/

const handleRequest = config => {
  // 在這裡加入您的邏輯
  return config
};

/**
  * 攔截每個 AJAX HTTP Request Error 進行處理
  * @param {*} error
*/
const handleRequestError = error => {
  // 在這裡加入您的邏輯
  return Promise.reject(error);
};

export { handleRequest, handleRequestError };