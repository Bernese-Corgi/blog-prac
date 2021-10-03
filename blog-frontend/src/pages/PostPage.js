import React from 'react';
import { PostViewer } from '../components/post';
import { HeaderContainer } from '../container/common';

const PostPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostViewer />
    </>
  );
};

export default PostPage;
