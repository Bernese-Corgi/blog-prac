import { finishLoading, startLoading } from '../modules/loading';
import { put, call } from 'redux-saga/effects';

export const createRequestActionTypes = (type) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    // 로딩 시작
    yield put(startLoading(type));

    try {
      const response = yield call(request, action.payload);
      // 데이터 요청 성공
      // 액션 안에 meta 값을 response로 넣어 주면 나중에 HTTP 헤더 및 상태 코드를 쉽게 조회할 수 있다.
      yield put({ type: SUCCESS, payload: response.data, meta: response });
    } catch (e) {
      // 데이터 요청 실패
      yield put({ type: FAILURE, payload: e, error: true });
    }

    // 로딩 끝
    yield put(finishLoading(type));
  };
}
