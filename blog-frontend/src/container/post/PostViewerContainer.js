import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { readPost, unloadPost } from '../../modules/post';
import { PostActionButtons, PostViewer } from '../../components/post';
import { setOriginalPost } from '../../modules/write';

const PostViewerContainer = ({ match, history }) => {
  // URL 파라미터로 받아온 id 값을 조회
  const { postId } = match.params;

  const dispatch = useDispatch();

  // 리덕스 스토어에서 post, error, loading 참조
  const { post, error, loading, user } = useSelector(
    ({ post, loading, user }) => ({
      post: post.post,
      error: post.error,
      loading: loading['post/READ_POST'],
      user: user.user,
    }),
  );

  console.log(post);

  useEffect(() => {
    dispatch(readPost(postId));
    return () => {
      // 언마운트 시 UNLOAD_POST 액션 실행
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  /* 수정 버튼 클릭 시 이벤트 ----------------------------- */
  const onEdit = () => {
    dispatch(setOriginalPost(post));
    history.push('/write');
  };

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={<PostActionButtons onEdit={onEdit} />}
      ownPost={user && user.id === post && post.id}
    />
  );
};

export default withRouter(PostViewerContainer);
