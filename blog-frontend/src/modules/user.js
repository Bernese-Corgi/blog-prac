import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import { takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// 새로고침 이후 임시 로그인 처리
const TEMP_SET_USER = 'user/TEMP_SET_USER';

// 회원 정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] =
  createRequestActionTypes('user/CHECK');

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// 새로고침 이후 임시 로그인 처리
export const tempSetUser = createAction(TEMP_SET_USER, (user) => user);

// 회원 정보 확인
export const check = createAction(CHECK);

/* ---------------------------------- 사가 함수 --------------------------------- */
// 회원 정보 확인
const checkSaga = createRequestSaga(CHECK, authAPI.check);

// user saga
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  user: null,
  checkError: null,
};

/* ----------------------------------- 리듀서 ---------------------------------- */
export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({ ...state, user }),
    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      checkError: error,
    }),
  },
  initialState,
);
