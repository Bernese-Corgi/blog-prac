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

// 사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postsAPI.writePost);

export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  title: '',
  body: '',
  tags: [],
  post: null,
  postError: null,
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
  },
  initialState,
);

export default write;
