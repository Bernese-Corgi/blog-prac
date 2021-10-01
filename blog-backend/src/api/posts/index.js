import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkedLoggedIn';

/* --------------------------------- 라우트 설정 --------------------------------- */
const posts = new Router();
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());

/* 아래와 같이 작성할 수도 있다. ---------------------------------
posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);

// /api/posts/:id 경로를 위한 라우터를 새로 만들고,
const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.remove);
post.patch('/', postsCtrl.update);

// posts에 해당 라우터를 등록
posts.use('/:id', postsCtrl.checkObjectId, post.routes());

export default posts;
------------------------------------------------------------ */

/* -------------------------------- 라우터 내보내기 -------------------------------- */
export default posts;
