import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../lib/styles';
import { AskRemoveModal } from '.';

/**
 * 포스트 작성자에게만 포스트 상단에 수정 버튼과 삭제 버튼이 나타나도록 렌더링
 */

const PostActionButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  margin-top: -1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${palette.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: ${palette.gray[1]};
    color: ${palette.cyan[7]};
  }
  & + & {
    margin-left: 0.25rem;
  }
`;

const PostActionButtons = ({ onEdit, onRemove }) => {
  const [modal, setModal] = useState(false);

  /* ActionButton 이벤트 ---------------------------- */
  // 삭제 버튼 클릭
  const onRemoveClick = () => {
    setModal(true);
  };

  /* AskRemoveModal 이벤트 --------------------------- */
  // 취소 버튼 클릭
  const onCancel = () => {
    setModal(false);
  };

  // 확인 버튼 클릭
  const onConfirm = () => {
    setModal(false);
    onRemove();
  };

  return (
    <>
      <PostActionButtonsBlock>
        <ActionButton onClick={onEdit}>수정</ActionButton>
        <ActionButton onClick={onRemoveClick}>삭제</ActionButton>
      </PostActionButtonsBlock>
      <AskRemoveModal
        visible={modal}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default PostActionButtons;
