import _grid_ from "./grid-db";

import * as fs from 'fs';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cors from 'koa2-cors';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());
app.use(cors());

// add url-route:
/** 样例代码 */
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

router.get('/demo', async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./index.html');
});

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
router.post('/setSellGrid', async (ctx, next) => {
    const requestData = ctx.request.body || {};
    console.info('-->requestData: ', requestData);
    let thisGrid: any;
    if (requestData.code !== '555') {
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
/** 业务代码-结束 */

app.use(router.routes());

const HTTP_PORT = 8080;
app.listen(HTTP_PORT);
console.log('Server running http://132.232.142.128 on port ' + HTTP_PORT);