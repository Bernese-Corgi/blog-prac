const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const api = require('./api');

/* --------------------------------- 라우터 설정 --------------------------------- */
// api 라우트 적용
router.use('/api', api.routes());

/* ---------------------------- app 인스턴스에 라우터 적용 ---------------------------- */
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
