import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { PostList } from '../../components/posts';
import { listPosts } from '../../modules/posts';
import { withRouter } from 'react-router';

const PostListContainer = ({ location }) => {
  const dispatch = useDispatch();

  const { posts, error, loading, user } = useSelector(
    ({ posts, loading, user }) => ({
      posts: posts.posts,
      error: posts.error,
      loading: loading['posts/LIST_POST'],
      user: user.user,
    }),
  );

  useEffect(() => {
    const { tag, username, page } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    dispatch(listPosts({ tag, username, page }));
  }, [dispatch, location.search]);

  return (
    <>
      <PostList
        loading={loading}
        error={error}
        posts={posts}
        // 현재 로그인 중인 사용자의 정보를 가지고 있는 user 객체 설정
        // user 객체가 유효할 때(사용자가 로그인 중일때)만 포스트를 작성하는 버튼이 나온다.
        showWriteButton={user}
      />
    </>
  );
};

export default withRouter(PostListContainer);
