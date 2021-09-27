require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

/* ------------------------------- 환경 변수 파일 참조 ------------------------------ */
// process.env 내부 값에 대한 레퍼런스
const { PORT } = process.env;

const api = require('./api');

/* --------------------------------- 라우터 설정 --------------------------------- */
// api 라우트 적용
router.use('/api', api.routes());

/* ------------------------ bodyParser 적용 (라우터 적용 전에) ----------------------- */
app.use(bodyParser());

/* ---------------------------- app 인스턴스에 라우터 적용 ---------------------------- */
app.use(router.routes()).use(router.allowedMethods());

/* ---------------------------------- 포트 지정 --------------------------------- */
const port = PORT || 4000; // PORT가 지정되어 있지 않다면 4000을 사용

app.listen(port, () => {
  console.log('Listening to port %d', port);
});
