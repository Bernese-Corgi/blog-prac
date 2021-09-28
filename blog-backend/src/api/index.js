import Router from 'koa-router';
import posts from './posts';
import auth from './auth';

const api = new Router();

/* -------------------------------- 라우트 불러오기 -------------------------------- */
api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

/* -------------------------------- 라우터 내보내기 ------------------------------- */
export default api;
