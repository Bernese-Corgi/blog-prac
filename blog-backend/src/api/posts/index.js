const Router = require('koa-router');
const posts = new Router();

const printInfo = (ctx) => {
  // JSON 객체 : 현재 요청의 메서드, 경로, 파라미터 포함
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

/* ------------------------ 라우트 설정 및 printInfo 함수 호출 ------------------------ */
posts.get('/', printInfo);
posts.post('/', printInfo);
posts.get('/:id', printInfo);
posts.delete('/:id', printInfo);
posts.put('/:id', printInfo);
posts.patch('/:id', printInfo);

/* -------------------------------- 라우터 내보내기 -------------------------------- */
module.exports = posts;
