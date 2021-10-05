import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// 포스트 목록 조회
const [LIST_POST, LIST_POST_SUCCESS, LIST_POST_FAILURE] =
  createRequestActionTypes('posts/LIST_POST');

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// 포스트 목록 조회
export const listPosts = createAction(LIST_POST, ({ tag, username, page }) => ({
  tag,
  username,
  page,
}));

/* ---------------------------------- saga ---------------------------------- */
// 포스트 목록 조회
const listPostsSaga = createRequestSaga(LIST_POST, postsAPI.listPosts);

// posts saga
export function* postsSaga() {
  yield takeLatest(LIST_POST, listPostsSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  posts: null,
  error: null,
  lastPage: 1,
};

/* ----------------------------------- 리듀서 ---------------------------------- */
const posts = handleActions(
  {
    [LIST_POST_SUCCESS]: (state, { payload: posts, meta: response }) => ({
      ...state,
      posts,
      // 문자열을 숫자로 변환
      lastPage: parseInt(response.headers['last-page'], 10),
    }),
    [LIST_POST_FAILURE]: (state, { payload: error }) => ({ ...state, error }),
  },
  initialState,
);

export default posts;
