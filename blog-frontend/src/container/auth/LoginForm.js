import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { AuthForm } from '../../components/auth';
import { changeField, initializeForm, login } from '../../modules/auth';
import { check } from '../../modules/user';

const LoginForm = ({ history }) => {
  // 에러 상태 관리
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  /* input 변경 이벤트 핸들러 ---------------------------- */
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(changeField({ form: 'login', key: name, value }));
  };

  /* 폼 등록 이벤트 핸들러 ------------------------------ */
  const onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = form;
    // onSubmit 이벤트가 발생했을 때 login 함수에 현재 username과 password를 파라미터로 넣어 액션을 디스패치
    dispatch(login({ username, password }));
  };

  /* form 초기화 -------------------------------- */
  useEffect(() => {
    // 컴포넌트 처음 렌더링될 때 form을 초기화
    dispatch(initializeForm('login'));
  }, [dispatch]);

  /* 로그인 성공/실패 처리 ------------------------------ */
  useEffect(() => {
    // authError 값이 유효한 경우
    if (authError) {
      console.log('오류 발생');
      console.log(authError);
      setError('로그인 실패');
      return;
    }
    // auth 값이 유효한 경우
    if (auth) {
      console.log('로그인 성공');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  /* user 값이 성공적으로 설정되면 메인 화면으로 이동 --------------------- */
  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(LoginForm);
