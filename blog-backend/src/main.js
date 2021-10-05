require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import api from './api';
import mongoose from 'mongoose';
import jwtMiddleware from './lib/jwtMiddleware';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

/* ------------------------------- 환경 변수 파일 참조 ------------------------------ */
// process.env 내부 값에 대한 레퍼런스
const { PORT, MONGO_URI } = process.env;

/* ------------------------------- mongoose 설정 ------------------------------ */
// 서버와 데이터베이스 연결
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

/* --------------------------------- 라우터 설정 --------------------------------- */
// api 라우트 적용
router.use('/api', api.routes());

/* --------------------------------- 미들웨어 적용 -------------------------------- */
/* 라우터 전에 적용해야할 미들웨어 --------------------------- */
// bodyParser 적용
app.use(bodyParser());
// jwtMiddleware 적용
app.use(jwtMiddleware);

/* app 인스턴스에 라우터 적용 ---------------------------- */
app.use(router.routes()).use(router.allowedMethods());

/* ------------------------------- koa-static ------------------------------- */
// blog-frontend/build 디렉터리의 파일들을 서버를 통해 조회
const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  // send 미들웨어 : 클라이언트 기반 라우팅이 제대로 작동하게 한다.
  // 1. Not Found이고, 주소가 /api로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    // 2. index.html 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

/* ---------------------------------- 포트 지정 --------------------------------- */
const port = PORT || 4000; // PORT가 지정되어 있지 않다면 4000을 사용

app.listen(port, () => {
  console.log('Listening to port %d', port);
});
