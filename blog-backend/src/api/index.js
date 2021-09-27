const Router = require('koa-router');
const posts = require('./posts');

const api = new Router();

/* -------------------------------- 라우트 불러오기 -------------------------------- */
api.use('/posts', posts.routes());

/* -------------------------------- 라우터 내보내기 ------------------------------- */
module.exports = api;
