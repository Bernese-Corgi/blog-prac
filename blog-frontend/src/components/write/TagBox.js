import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../lib/styles';

/* ------------------------------ 태그 박스 스타일 블록 ------------------------------ */
const TagBoxBlock = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[2]};
  padding-top: 2rem;

  h4 {
    color: ${palette.gray[8]};
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`;

/* -------------------------------- 태그 폼 스타일 -------------------------------- */
const TagForm = styled.form`
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  width: 256px;
  border: 1px solid ${palette.gray[9]}; /* 스타일 초기화 */

  input,
  button {
    outline: none;
    border: none;
    font-size: 1rem;
  }

  input {
    padding: 0.5rem;
    flex: 1;
  }

  button {
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    border: none;
    background: ${palette.gray[8]};
    color: white;
    font-weight: bold;
    &:hover {
      background: ${palette.gray[6]};
    }
  }
`;

/* --------------------------------- 태그 스타일 --------------------------------- */
const Tag = styled.div`
  margin-right: 0.5rem;
  color: ${palette.gray[6]};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

/* ------------------------------ 태그 리스트 스타일 블록 ----------------------------- */
const TagListBlock = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

/** TagBox: 두 가지 상황에서 렌더링
 * 1. input이 바뀔 때 : TagItem 리렌더링
 * 2. 태그 목록이 바뀔 때 : TagList 리렌더링.
 * 두 가지 상황을 나누어서 컴포넌트를 분리시키면, 렌더링을 최적화할 수 있다.
 * 컴포넌트를 분리하지 않으면 1. input 값이 바뀔때 태그 목록도 리렌더링 된다. 2. 태그 목록이 리렌더링되면 태그 하나하나가 모두 리렌더링된다.
 * 컴포넌트를 분리하면, 1. input 값이 바뀌어도 TagList 컴포넌트가 리렌더링되지 않고, 2. 태그 목록이 변해도 이미 렌더링 중인 TagItem들은 리렌더링되지 않고, 실제로 추가되거나 삭제되는 태그에만 영향을 미친다.
 * React.memo를 사용해 컴포넌트를 감싸면, 해당 컴포넌트가 받아오는 props가 실제로 바뀔때만 리렌더링된다.
 */
// React.memo : tag 값이 바뀔 때만 렌더링도록 처리
const TagItem = React.memo(({ tag, onRemove }) => (
  <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>
));

// React.memo : tags 값이 바뀔 때만 렌더링도록 처리
const TagList = React.memo(({ tags, onRemove }) => (
  <TagListBlock>
    {tags.map((tag) => (
      <TagItem key={tag} tag={tag} onRemove={onRemove} />
    ))}
  </TagListBlock>
));

/* ---------------------------------- 태그 박스 --------------------------------- */
const TagBox = ({ tags, onChangeTags }) => {
  /* 상태 관리 --------------------------------- */
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState([]);

  /* 태그 삽입 함수 -------------------------------- */
  const insertTag = useCallback(
    (tag) => {
      // 공백이면 추가하지 않음
      if (!tag) return;
      // 이미 존재하면 추가하지 않음
      if (localTags.includes(tag)) return;
      // 태그 추가
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
      /* TagBox 컴포넌트 내부에서 상태가 바뀌면 리덕스 스토어에 반영
      추가된 태그를 onChangeTags에 전달 (write 모듈의 필드 중 태그 값의 변화를 적용하는 디스패치를 수행하는 함수) */
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );

  /* 태그 삭제 이벤트 ------------------------------- */
  const onRemove = useCallback(
    (tag) => {
      setLocalTags(localTags.filter((t) => t !== tag));
    },
    [localTags],
  );

  /* input value 변화 이벤트 --------------------------- */
  const onChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  /* 태그 제출 이벤트 ------------------------------- */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // 앞뒤 공백을 없앤 후 등록
      insertTag(input.trim());
      // input 초기화
      setInput('');
    },
    [input, insertTag],
  );

  /* props로 받아온 tags 값이 바뀔때 localTags 상태 업데이트 ---------------- */
  useEffect(() => {
    // 리덕스 스토어의 값이 바뀌면 TagBox 컴포넌트 내부의 상태도 변경
    setLocalTags(tags);
  }, [tags]);

  return (
    <TagBoxBlock>
      <h4>태그</h4>
      <TagForm onSubmit={onSubmit}>
        <input
          placeholder="태그를 입력하세요"
          value={input}
          onChange={onChange}
        />
        <button type="submit">추가</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove} />
    </TagBoxBlock>
  );
};

export default TagBox;
