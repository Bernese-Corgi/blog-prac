import React from 'react';
import { AuthTemplate } from '../components/auth';
import { RegisterForm } from '../container/auth';

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
};

export default RegisterPage;
