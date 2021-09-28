import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

/* ------------------------------- 요청 검증 미들웨어 ------------------------------- */
const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
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
  const post = new Post({ title, body, tags }); // 매개변수 : 정보를 지닌 객체 전달
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
  const page = parseInt(ctx.query.page || '1', 10);

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
      .skip((page - 1) * 10)
      .exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* -------------------------------- 특정 포스트 조회 ------------------------------- */
// GET /api/posts/:id
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    // findById 특정 id를 가진 데이터를 조회
    const post = await Post.findById(id).exec();

    // 포스트가 없으면 오류를 반환
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
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
