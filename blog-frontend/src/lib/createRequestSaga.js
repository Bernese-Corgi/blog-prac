import { finishLoading, startLoading } from '../modules/loading';
import { put, call } from 'redux-saga/effects';

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    // 로딩 시작
    yield put(startLoading(type));

    try {
      const response = yield call(request, action.payload);
      // 데이터 요청 성공
      yield put({ type: SUCCESS, payload: response.data });
    } catch (e) {
      // 데이터 요청 실패
      yield put({ type: FAILURE, payload: e, error: true });
    }

    // 로딩 끝
    yield put(finishLoading(type));
  };
}
