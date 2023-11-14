
import axios from 'axios';

const BaseService = {
  defaultParams: {
    pageIndex: 1,
    pageSize: 15,
    orderBy: []
  },
  post(url, params, config = { headers: {noAlert: false}}) {
    return axios
      .post(url, params, config)
      .then((res) => {
        return res;
      })
      .catch(err => {
        console.error(`request error: [[${url}]]`, params, config);
        throw err;
      });
  },
  get(url, params) {
    return axios
      .get(url, params)
      .then((res) => {
        return res;
      })
      .catch(err => {
        console.error(`request error: [[${url}]]`);
        throw err;
      });
  }
};


export { BaseService }