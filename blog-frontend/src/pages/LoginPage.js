import React from 'react';
import { AuthForm, AuthTemplate } from '../components/auth';

const LoginPage = () => {
  return (
    <AuthTemplate>
      <AuthForm type="login" />
    </AuthTemplate>
  );
};

export default LoginPage;
