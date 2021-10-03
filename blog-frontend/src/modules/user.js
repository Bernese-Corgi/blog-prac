import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import { call, takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// 새로고침 이후 임시 로그인 처리
const TEMP_SET_USER = 'user/TEMP_SET_USER';

// 회원 정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] =
  createRequestActionTypes('user/CHECK');

// 로그아웃
// 로그아웃의 경우에는 성공/실패 여부가 중요하지 않으므로 LOGOUT_SUCCESS, LOGOUT_FAILURE와 같은 액션은 따로 만들지 않아도 된다.
const LOGOUT = 'user/LOGOUT';

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// 새로고침 이후 임시 로그인 처리
export const tempSetUser = createAction(TEMP_SET_USER, (user) => user);

// 회원 정보 확인
export const check = createAction(CHECK);

// 로그아웃
export const logout = createAction(LOGOUT);

/* ---------------------------------- 사가 함수 --------------------------------- */
// 회원 정보 확인
const checkSaga = createRequestSaga(CHECK, authAPI.check);

// CHECK 액션 디스패치 실패 사가 함수
function checkFailureSaga() {
  // CHECK 액션이 디스패치되면 사가를 통해 /api/check API를 호출
  // 이 API는 성공할 수도 있고, 실패할 수도 있다.
  // 만약 실패하면, 사용자 상태를 초기화해야 하고 localStorage에 들어 있는 값도 지워야 한다.
  try {
    // localStroage에서 user를 제거
    localStorage.removeItem('user');
    // user 값 초기화는 리듀서에서 처리하고 있으므로 신경쓰지 않아도 된다.
  } catch (e) {
    console.log('localStorage is not working');
  }
}

// 로그아웃
function* logoutSaga() {
  try {
    // logout API 호출
    yield call(authAPI.logout);
    // localStorage에서 user를 제거
    localStorage.removeItem('user');
  } catch (e) {
    console.log(e);
  }
}

// user saga
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
  // CHECK_FAILURE 액션이 발생할 때 checkFailureSaga 함수 호출
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
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
    [LOGOUT]: (state) => ({ ...state, user: null }),
  },
  initialState,
);
