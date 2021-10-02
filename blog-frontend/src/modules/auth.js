import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import { takeLatest } from '@redux-saga/core/effects';

/* ---------------------------------- 액션 타입 --------------------------------- */
// auth 공통 액션
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

// register 액션
const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] =
  createRequestActionTypes('auth/REGISTER');

// register 액션
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
  createRequestActionTypes('auth/LOGIN');

/* -------------------------------- 액션 생성 함수 -------------------------------- */
// auth 공통
export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form, // register, login
    key, // username, password, passwordConfirm
    value, // 실제 바꾸려는 값
  }),
);
/*
export const changeField = ({ form, key, value }) => ({
  type: CHANGE_FIELD,
  payload: {
    form,
    key,
    value
  }
})
*/

export const initializeForm = createAction(
  INITIALIZE_FORM,
  (form) => form, // register/login
);

// register
export const register = createAction(
  REGISTER,
  ({ username, password }) => ({ username, password }), //
);

// login
export const login = createAction(
  LOGIN,
  ({ username, password }) => ({ username, password }), //
);

/* ---------------------------------- 사가 생성 --------------------------------- */
// register saga
const registerSaga = createRequestSaga(REGISTER, authAPI.register);

// login saga
const loginSaga = createRequestSaga(LOGIN, authAPI.login);

// auth saga
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

/* ---------------------------------- 초기 상태 --------------------------------- */
const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    username: '',
    password: '',
  },
  auth: null,
  authError: null,
};

/* ----------------------------------- 리듀서 ---------------------------------- */
/** handleActions(reducerMap, initialState)
 * @param reducerMap 액션에 따라 실행할 함수들을 프로퍼티로 가지는 객체
 * @param initialState 초기 상태 값
 */
const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      /** produce(baseState, recipe: (draftState) => void): nextState
       * baseState가 변경되지 않지만, nextState는 draftState에 대한 모든 변경 사항을 반영한다.
       * @param baseState produce하기 위해 전달된 불변하는 상태
       * @param recipe 전달된 draftState에서 원하는 모든 변형을 수행하는 함수. 자바스크립트의 모든 표준 API를 사용할 수 있다.
       * @param draftState 안전하게 변경될 수 있는 원래 기본 상태에 대한 프록시.
       * @returns 새로운 상태를 반환. 아무것도 수정되지 않으면 초기 상태를 반환
       */
      produce(state, (draft) => {
        draft[form][key] = value; // 예: state.register.username을 바꾼다.
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
      // 폼 전환 시 회원 인증 에러 초기화
      authError: null,
    }),
    /* 회원 가입 성공 -------------------------------- */
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    /* 회원 가입 실패 -------------------------------- */
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    /* 로그인 성공 --------------------------------- */
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    /* 로그인 성공 --------------------------------- */
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
  },
  initialState,
);

export default auth;
