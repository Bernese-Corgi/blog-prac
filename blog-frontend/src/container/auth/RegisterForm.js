import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { AuthForm } from '../../components/auth';

import { changeField, initializeForm, register } from '../../modules/auth';
import { check } from '../../modules/user';

const RegisterForm = ({ history }) => {
  // 에러 상태
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  /* input 변경 이벤트 핸들러 ---------------------------- */
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(changeField({ form: 'register', key: name, value }));
  };

  /* 폼 등록 이벤트 핸들러 ------------------------------ */
  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;

    // username, password, passwordConfirm 중 하나라도 비어있으면 에러 처리
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하세요');
      return;
    }

    // 패스워드가 일치하지 않으면 에러 처리
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      changeField({ form: 'register', key: 'password', value: '' });
      changeField({ form: 'register', key: 'passwordConfirm', value: '' });
      return;
    }

    // onSubmit 이벤트가 발생했을 때 register 함수에 현재 username과 password를 파라미터로 넣어 액션을 디스패치
    dispatch(register({ username, password }));
  };

  /* form 초기화 -------------------------------- */
  useEffect(() => {
    // 컴포넌트 처음 렌더링될 때 form을 초기화
    dispatch(initializeForm('register'));
  }, [dispatch]);

  /* 회원가입 성공/실패 처리 ----------------------------- */
  // 결과를 얻었을 때 특정 작업을 하기 위해 useEffect 사용
  useEffect(() => {
    // authError 값이 유효한 경우의 에러 처리
    if (authError) {
      // 계정명이 이미 존재하면 에러 처리
      if (authError.response.status === 409) {
        setError('이미 존재하는 계정명입니다.');
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      return;
    }
    // auth 값이 유효한 경우
    if (auth) {
      console.log('회원가입 성공');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  /* user 값이 잘 설정되었는지 확인 -------------------------- */
  useEffect(() => {
    if (user) {
      console.log('check API 성공');
      console.log(user);
      history.push('/');
    }
  }, [user, history]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(RegisterForm);
