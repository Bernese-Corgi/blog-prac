import React from 'react';
import { AuthTemplate } from '../components/auth';
import { LoginForm } from '../container/auth';

const LoginPage = () => {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;
