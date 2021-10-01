import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

/* ---------------------------------- 미들웨어 ---------------------------------- */
const { ObjectId } = mongoose.Types;

/* 요청 검증, id로 post 찾기 미들웨어 ------------------------ */
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }

  try {
    // id로 포스트 찾기
    const post = await Post.findById(id);

    // 포스트가 존재하지 않으면 Not Found
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    // ctx.state에 포스트 넣기
    ctx.state.post = post;
    console.log(ctx.state);

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 로그인 중인 사용자가 작성한 포스트인지 확인하는 미들웨어 -------------------- */
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;

  // 사용자가 작성한 포스트가 아니면 403 에러 발생
  if (post.user._id.toString() !== user._id) {
    // MongoDB에서 조회한 데이터의 id 값을 문자열과 비교할 때는 반드시 .toString() 메서드로 문자열로 변환해야한다.
    ctx.status = 403;
    return;
  }
  return next();
};

/* --------------------------------- 포스트 작성 --------------------------------- */
// POST /api/posts { title, body }
// { title: '제목', body: '내용', tags: [ '태그1', '태그2' ] }
export const write = async (ctx) => {
  // request body 검증을 위한 스키마
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  // REST API의 Request Body는 ctx.request.body에서 조회할 수 있다.
  const { title, body, tags } = ctx.request.body;

  // Post의 인스턴스 생성 : new 키워드 사용
  const post = new Post({ title, body, tags, user: ctx.state.user }); // 매개변수 : 정보를 지닌 객체 전달
  try {
    /** save()
     * @returns Promise 객체
     * await를 사용해 데이터 베이스 저장 요청을 완료할 때까지 대기할 수 있다.
     */
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* -------------------------------- 포스트 목록 조회 ------------------------------- */
// GET /api/posts
export const list = async (ctx) => {
  // ctx의 쿼리에서 페이지 참조하기
  // query는 문자열이므로 숫자로 변환해야한다.
  const page = parseInt(
    ctx.query.page || '1' /*값이 주어지지 않았다면 1을 사용*/,
    10,
  );
  //
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    /** find([callback])
     * @param callback
     */
    /** exec()
     * 서버에 쿼리 요청
     * 데이터를 조회할 때 특정 조건을 설정하고, 불러오는 제한 설정 가능
     */
    const posts = await Post.find()
      .sort({ _id /*정렬할 필드*/: -1 /*내림차순*/ })
      .limit(10) // 보이는 개수 제한
      .skip((page - 1) * 10) // 페이지를 10개씩 띄우기
      .lean() // 데이터를 JSON 형태로 조회
      .exec();

    // 마지막 페이지 번호
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-page', Math.ceil(postCount / 10));

    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* -------------------------------- 특정 포스트 조회 ------------------------------- */
// GET /api/posts/:id
export const read = async (ctx) => {
  ctx.body = ctx.state.body;
};

/* -------------------------------- 특정 포스트 제거 ------------------------------- */
// DELETE /api/posts/:id
export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    /** 데이터 삭제할 때 사용할 수 있는 함수
     * remove(): 특정 조건을 만족하는 데이터를 모두 지운다.
     * findByIdAndRemove(): id를 찾아서 지운다.
     * findOneAndRemove(): 특정 조건을 만족하는 데이터 하나를 찾아서 제거한다.
     */
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* ------------------------------- 포스트 수정 (교체) ------------------------------
// PUT /api/posts/:id { title, body }
// PUT : 전체 포스트 정보를 입력해 데이터를 통째로 교환할 때 사용
export const replace = (ctx) => {
  const { id } = ctx.params;

  // 해당 id를 가진 post가 몇 번째인지 확인한다
  const index = posts.findIndex((p) => p.id.toString() === id);

  // 포스트가 없으면 오류를 반환
  if (index === -1) {
    ctx.status = 404;
    ctx.body = { message: '포스트가 존재하지 않습니다.' };
    return;
  }

  // 전체 객체를 덮어 씌운다
  posts[index] = {
    id, // 기존 정보 중 id만 남긴다.
    ...ctx.request.body, // id를 제외한 새로운 객체를 덮어 씌운다.
  };

  ctx.body = posts[index];
};
*/

/* ---------------------------- 포스트 수정 (특정 필드 변경) --------------------------- */
// PATCH /api/posts/:id { title, body }
// PATCH 메서드는 주어진 필드만 교체한다
export const update = async (ctx) => {
  // request body 검증을 위한 스키마
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증 후 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.params;

  try {
    /** findByIdAndUpdate()
     * @param id?: 찾을 아이디
     * @param update?: 업데이트 내용
     * @param options?: 업데이트의 옵션
     */
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      /** new
       * true : 업데이트된 데이터를 반환
       * false : 업데이트되기 전의 데이터 반환
       */
      new: true,
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
