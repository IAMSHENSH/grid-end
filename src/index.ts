// import num = require("./grid");
import _grid_ from "./grid";
console.log(_grid_.getLevelPrice());
console.log(_grid_.getThisGrid());
console.log(_grid_.getGridSellPrice());
console.log(_grid_.getNextGridPrice());

import * as Koa from 'koa';
import * as Router from 'koa-router';
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


/** 业务代码-开始 */

router.get('/getLevelPrice', async (ctx, next) => {
    ctx.response.body = _grid_.getLevelPrice();
});
router.get('/getThisGrid', async (ctx, next) => {
    ctx.response.body = _grid_.getThisGrid();
});
router.get('/getGridSellPrice', async (ctx, next) => {
    ctx.response.body = _grid_.getGridSellPrice();
});
router.get('/getNextGridPrice', async (ctx, next) => {
    ctx.response.body = _grid_.getNextGridPrice();
});


/** 业务代码-结束 */

app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');
