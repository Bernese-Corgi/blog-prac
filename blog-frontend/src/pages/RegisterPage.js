import React from 'react';
import { AuthForm, AuthTemplate } from '../components/auth';

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <AuthForm type="register" />
    </AuthTemplate>
  );
};

export default RegisterPage;
