import React from 'react';
import { HeaderContainer } from '../container/common';
import { PaginationContainer, PostListContainer } from '../container/posts';

const PostListPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostListContainer />
      <PaginationContainer />
    </>
  );
};

export default PostListPage;
