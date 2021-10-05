import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { palette } from '../../lib/styles';

const buttonStyle = css`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;
  background: ${palette.gray[8]};

  &:hover {
    background: ${palette.gray[6]};
  }

  ${(props) =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${(props) =>
    props.cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}
    
    &:disabled {
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle}
`;

// 자동 import 가능하게 해준다.
const Button = (props) => {
  // props.to 값에 따라 StyledLink/StyledButton 사용
  return props.to ? (
    <StyledLink
      {...props}
      // styled() 함수로 감싸서 만든 컴포넌트의 경우에는 임의 props가 필터링되지 않기 때문에 1 또는 0으로 변환한다.
      // Link 컴포넌트 내부의 a태그는 불리언 값이 임의 props로 설정되는 것을 허용하지 않기 때문에 cyan={true}를 사용할 수 없다.
      cyan={props.cyan ? 1 : 0}
    />
  ) : (
    // styled
    <StyledButton {...props} />
  );
};

export default Button;
