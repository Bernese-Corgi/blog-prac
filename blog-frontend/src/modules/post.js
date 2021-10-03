import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// 특정 포스트 읽기
const [READ_POST, READ_POST_SUCCESS, READ_POST_FAILURE] =
  createRequestActionTypes('post/READ_POST');

// 포스트 페이지에서 벗어날 때 데이터 비우기
const UNLOAD_POST = 'post/UNLOAD_POST';

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// 특정 포스트 읽기
export const readPost = createAction(READ_POST, (id) => id);

// 포스트 페이지에서 벗어날 때 데이터 비우기
export const unloadPost = createAction(UNLOAD_POST);

/* ---------------------------------- saga ---------------------------------- */
// 특정 포스트 읽기
const readPostSaga = createRequestSaga(READ_POST, postsAPI.readPost);

// postSaga
export function* postSaga() {
  yield takeLatest(READ_POST, readPostSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  post: null,
  error: null,
};

/* ----------------------------------- 리듀서 ---------------------------------- */
const post = handleActions(
  {
    [READ_POST_SUCCESS]: (state, { payload: post }) => ({ ...state, post }),
    [READ_POST_FAILURE]: (state, { payload: error }) => ({ ...state, error }),
    [UNLOAD_POST]: () => initialState,
  },
  initialState,
);

export default post;
