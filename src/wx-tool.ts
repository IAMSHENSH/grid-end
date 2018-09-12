import axios from 'axios';

const APPID = '';
const APPSECRET = '';

let wxtool = {
  getUserId: function (code: any) {
    return new Promise(function (resolve, reject) {
      let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + APPSECRET + '&js_code=' + code + '&grant_type=authorization_code';
      axios.get(url)
        .then(function (response) {
          resolve(response.data);
      });
    })
  }
}

export default wxtool;