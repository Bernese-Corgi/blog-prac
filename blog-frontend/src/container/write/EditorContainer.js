import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '../../components/write';
import { changeField, initialize } from '../../modules/write';

const EditorContainer = () => {
  const dispatch = useDispatch();

  /* 리덕스 스토어에서 title, body값 추출 ----------------------- */
  const { title, body } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
  }));

  /* 필드 값 변경 이벤트 ------------------------------ */
  // useCallback으로 감싸야 나중에 Editor에서 사용할 useEffect가 컴포넌트 화면에 나타났을 때 딱 한번만 실행한다.
  const onChangeField = useCallback(
    (payload) => dispatch(changeField(payload)),
    [dispatch],
  );

  /* 언마운트될 때 초기화 ------------------------------ */
  // WritePage에서 벗어날 때 데이터를 초기화해야 하므로, 컴포넌트가 언마운트될 때 useEffect로 INITAILIZE 액션을 발생시켜 리덕스의 write 관련 상태를 초기화한다.
  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  // Quill 에디터는 일반 input이나 textarea가 아니기 때문에 onChagne, value 값을 사용해 상태를 관리할 수 없다.
  // 지금은 에디터에서 값이 바뀔 때 리덕스 스토어에 값을 넣는 작업만 한다.
  return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
