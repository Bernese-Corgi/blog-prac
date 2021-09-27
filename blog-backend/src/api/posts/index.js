const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');

const posts = new Router();

/* --------------------------------- 라우트 설정 --------------------------------- */
posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', postsCtrl.remove);
posts.put('/:id', postsCtrl.replace);
posts.patch('/:id', postsCtrl.update);

/* -------------------------------- 라우터 내보내기 -------------------------------- */
module.exports = posts;
