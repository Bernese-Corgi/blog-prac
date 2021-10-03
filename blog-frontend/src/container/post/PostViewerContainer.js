import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { readPost, unloadPost } from '../../modules/post';
import { PostViewer } from '../../components/post';

const PostViewerContainer = ({ match }) => {
  // URL 파라미터로 받아온 id 값을 조회
  const { postId } = match.params;

  const dispatch = useDispatch();

  // 리덕스 스토어에서 post, error, loading 참조
  const { post, error, loading } = useSelector(({ post, loading }) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    return () => {
      // 언마운트 시 UNLOAD_POST 액션 실행
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  return <PostViewer post={post} loading={loading} error={error} />;
};

export default withRouter(PostViewerContainer);
