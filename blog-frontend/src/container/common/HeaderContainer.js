import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/common';
import { logout } from '../../modules/user';

const HeaderContainer = () => {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const dispatch = useDispatch();
  const onLogout = () => {
    // logout 액션 생성 함수를 디스패치
    dispatch(logout());
  };

  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
