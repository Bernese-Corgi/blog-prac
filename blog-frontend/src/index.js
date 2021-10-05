import createSagaMiddleware from '@redux-saga/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import rootReducer, { rootSaga } from './modules';
import { check, tempSetUser } from './modules/user';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser() {
  try {
    const user = localStorage.getItem('user');
    // 로그인 상태가 아니라면 아무것도 안함
    if (!user) return;
    // 새로고침 이후 임시 로그인 처리 액션 디스패치
    store.dispatch(tempSetUser(user));
    // 사용자가 로그인 상태인지 확인하기 위해 회원 정보 확인 액션 디스패치
    store.dispatch(check());
  } catch (e) {
    console.log('localStorage is not working');
  }
}

sagaMiddleware.run(rootSaga);
// CHECK 액션 디스패치를 정상적으로 처리하려면 sagaMiddleware.run 호출 이후에 loadUser 함수를 호출해야 한다.
loadUser();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

reportWebVitals();
