import React from 'react';
import { Header } from '../components/common';
import { PostList } from '../components/posts';
import { HeaderContainer } from '../container/common';

const PostListPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostList />
    </>
  );
};

export default PostListPage;
