import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Responsive from '../common/Responsive';
import { palette } from '../../lib/styles';
import Quill from 'quill';

const EditorBlock = styled(Responsive)`
  /* 페이지 위 아래 여백 지정 */
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const TitleInput = styled.input`
  font-size: 3rem;
  outline: none;
  padding-bottom: 0.5rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;

const QuillWrapper = styled.div`
  /* 최소 크기 지정 및 padding 제거 */
  .ql-editor {
    padding: 0;
    min-height: 320px;
    font-size: 1.125rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 0px;
  }
`;

const Editor = ({ title, body, onChangeField }) => {
  // Quill을 적용할 DivElement를 설정
  const quillElement = useRef(null);
  // Quill 인스턴스 참조
  const quillInstance = useRef(null);

  useEffect(() => {
    /* quill 인스턴스 생성 ----------------------------- */
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
      placeholder: '내용을 작성하세요...',
      modules: {
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          [{ header: '1' }, { header: '2' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    /* quill에 text-change 이벤트 핸들러 등록 --------------------- */
    const quill = quillInstance.current;
    // quill 에디터의 변화 내용을 리덕스 스토어에 저장
    /** text-change 이벤트
     * Quill의 내용이 변경되었을 떄 발생.
     * delta: 변경 내용
     * oldDelta: 변경 전 편집기 내용의 표시
     * source: 변경 내용
     * source가 사용자로부터 시작된 경우 source는 'user'가 된다.
     */
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        onChangeField({ key: 'body', value: quill.root.innerHTML });
      }
    });
  }, [onChangeField]);

  /* 내용의 초기값을 이전에 입력된 내용으로 설정 ------------------------ */
  // body가 변경될 때마다 작성한 useEffect에 등록한 함수가 호출된다.
  // -> 컴포넌트가 마운트되고 나서 단 한번만 useEffect에 등록한 작업이 실행되도록 설정해야 한다.
  // useRef로 마운트 상태에 따라 작업을 처리하도록 설정할 수 있다.
  const mounted = useRef(false);
  useEffect(() => {
    // 마운트된 상태면 return - 밑의 코드들을 실행하지 않는다.
    if (mounted.current) return;
    // 마운트된 상태이므로 mounted.current를 true로 설정
    mounted.current = true;
    // quill 에디터의 현재 html을 body 값에 입력한다. (에디터 내부 값의 초기값을 이전의 입력된 내용으로 설정)
    quillInstance.current.root.innerHTML = body;
  }, [body]);
  // 위의 방법 말고, 의존성 배열을 비워도 해결된다.

  /* title input change 이벤트 ------------------------- */
  const onChangeTitle = (e) => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  return (
    <EditorBlock>
      <TitleInput
        placeholder="제목을 입력하세요"
        onChange={onChangeTitle}
        value={title}
      />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;
