import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { WriteActionButtons } from '../../components/write';
import { writePost } from '../../modules/write';

const WriteActionButtonsContainer = ({ history }) => {
  const dispatch = useDispatch();

  const { title, body, tags, post, postError } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
  }));

  /* 포스트 등록 --------------------------------- */
  const onPublish = () => {
    // 리덕스 스토어 안에 들어 있는 값 사용해 새 포스트 작성
    dispatch(writePost({ title, body, tags }));
  };

  /* 포스트 등록 취소 ------------------------------- */
  const onCancel = () => {
    // 취소 버튼을 누르면 브라우저에서 뒤로 가기
    history.goBack();
  };

  /* 성공 혹은 실패 시 할 작업 ---------------------------- */
  useEffect(() => {
    // 포스트 작성 성공
    if (post) {
      // 서버에서 응답한 포스트 정보의 _id, user 값을 참조
      const { _id, user } = post;
      // 서버에서 응답한 포스트의 경로로 이동
      history.push(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [history, post, postError]);

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};

export default withRouter(WriteActionButtonsContainer);
