import _grid_ from "./grid-db";
import _wxtool_ from './wx-tool'

import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cors from 'koa2-cors';
import * as bodyParser from 'koa-bodyparser';


const app = new Koa();
const router = new Router();

const SAFE_CODE = '555';


// log request URL:
app.use(async (ctx, next) => {
  console.log(` @ Process ${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// parse request body:
app.use(bodyParser());
app.use(cors());

// add url-route:
/** 样例代码 */

router.get('/', async (ctx, next) => {
  ctx.response.body = 'HELLO'
});

router.get('/demo', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./index.html');
});
router.get('/wxhandle', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./wx-handle.html');
});

/** 微信业务代码-开始 */

router.post('/getOpenid', async (ctx, next) => {
  const requestData = ctx.request.body || {};
  console.info('-->requestData: ', requestData.code);
  await _wxtool_.getUserId(requestData.code).then(function (data) {
    console.info('==>getOpenid : ',data);
    ctx.response.body = data;
  });
});
/** 微信业务代码-结束 */

/** 业务代码-开始 */

router.get('/getLevelPrice', async (ctx, next) => {
  ctx.response.body = _grid_.getLevelPrice();
});
router.get('/getAllGrid', async (ctx, next) => {
  await _grid_.getAllGrid().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getThisGrid', async (ctx, next) => {
  await _grid_.getThisGrid().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getGridSellPrice', async (ctx, next) => {
  await _grid_.getGridSellPrice().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getNextGridPrice', async (ctx, next) => {
  await _grid_.getNextGridPrice().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getSellingGrid', async (ctx, next) => {
  await _grid_.getSellingGrid().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getSellingGridChart', async (ctx, next) => {
  await _grid_.getSellingGridChart().then(function (data) {
    ctx.response.body = data;
  });
});
router.get('/getSoldGrid', async (ctx, next) => {
  await _grid_.getSoldGrid().then(function (data) {
    ctx.response.body = data;
  });
});
router.post('/setSellGrid', async (ctx, next) => {
  const requestData = ctx.request.body || {};
  console.info('-->requestData: ', requestData);
  let thisGrid: any;
  if (requestData.code === SAFE_CODE) {
    await _grid_.getThisGrid().then(function (data) {
      thisGrid = data;
    });
    thisGrid.selling = requestData;
    _grid_.setThisGridSelling(thisGrid).then(function (data) {})
    ctx.response.body = thisGrid;
  } else {
    ctx.response.body = 'error code'
  }
});
router.post('/setBugGrid', async (ctx, next) => {
  const requestData = ctx.request.body || {};
  console.info('-->requestData: ', requestData);
  let thisGrid: any;
  if (requestData.code === SAFE_CODE) {
    thisGrid = requestData;
    _grid_.setThisGridBuying(thisGrid).then(function (data) {})
    ctx.response.body = thisGrid;
  } else {
    ctx.response.body = 'error code'
  }
});
/** 业务代码-结束 */

app.use(router.routes());

const HTTP_PORT = 8080;
app.listen(HTTP_PORT);
console.log('Server running http://132.232.142.128 on port ' + HTTP_PORT);