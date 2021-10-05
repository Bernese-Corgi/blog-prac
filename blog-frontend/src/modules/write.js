import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// 모든 내용 초기화
const INITIALIZE = 'write/INITIALIZE';

// 특정 key 값 바꾸기
const CHANGE_FIELD = 'write/CHANGE_FIELD';

// 포스트 작성
const [WRITE_POST, WRITE_POST_SUCCESS, WRITE_POST_FAILURE] =
  createRequestActionTypes('write/WRITE_POST');

// 수정 버튼 클릭 시 글쓰기 페이지로 이동
const SET_ORIGINAL_POST = 'write/SET_ORIGINAL_POST';

// 포스트 수정
const [UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE] =
  createRequestActionTypes('write/UPDATE_POST');

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// 모든 내용 초기화
export const initialize = createAction(INITIALIZE);

// 특정 key 값 바꾸기
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));

// 포스트 작성
export const writePost = createAction(WRITE_POST, ({ title, body, tags }) => ({
  title,
  body,
  tags,
}));

// 수정 버튼 클릭 시 글쓰기 페이지로 이동
export const setOriginalPost = createAction(SET_ORIGINAL_POST, (post) => post);

// 포스트 수정
export const updatePost = createAction(
  UPDATE_POST,
  ({ id, title, body, tags }) => ({ id, title, body, tags }),
);

/* ---------------------------------- saga ---------------------------------- */
// 수정 버튼 클릭 시 글쓰기 페이지로 이동
const writePostSaga = createRequestSaga(WRITE_POST, postsAPI.writePost);

// 포스트 수정
const updatePostSaga = createRequestSaga(UPDATE_POST, postsAPI.updatePost);

// write saga
export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
  yield takeLatest(UPDATE_POST, updatePostSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  title: '',
  body: '',
  tags: [],
  post: null,
  postError: null,
  originalPostId: null,
};

/* ----------------------------------- 리듀서 ---------------------------------- */
const write = handleActions(
  {
    // 모든 내용 초기화
    [INITIALIZE]: (state) => initialState, // initialState를 넣으면 초기 상태로 바뀜
    // 특정 key 값 바꾸기
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value, // 특정 key 값을 업데이트
    }),
    // post, postError 초기화
    [WRITE_POST]: (state) => ({ ...state, post: null, postError: null }),
    // 포스트 작성 성공
    [WRITE_POST_SUCCESS]: (state, { payload: post }) => ({ ...state, post }),
    // 포스트 작성 실패
    [WRITE_POST_FAILURE]: (state, { payload: postError }) => ({
      ...state,
      postError,
    }),
    // 수정 버튼 클릭 시 글쓰기 페이지로 이동
    [SET_ORIGINAL_POST]: (state, { payload: post }) => ({
      ...state,
      title: post.title,
      body: post.body,
      tags: post.tags,
      originalPostId: post._id,
    }),
    // 포스트 수정 성공
    [UPDATE_POST_SUCCESS]: (state, { payload: post }) => ({ ...state, post }),
    // 포스트 수정 실패
    [UPDATE_POST_FAILURE]: (state, { payload: postError }) => ({
      ...state,
      postError,
    }),
  },
  initialState,
);

export default write;
