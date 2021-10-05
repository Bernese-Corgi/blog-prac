import React from 'react';
import { Responsive } from '../components/common';
import {
  EditorContainer,
  TagBoxContainer,
  WriteActionButtonsContainer,
} from '../container/write';
import { Helmet } from 'react-helmet-async';

const WritePage = () => {
  return (
    <>
      <Helmet>
        <title>글 작성하기 - JBLOG</title>
      </Helmet>
      <Responsive>
        <EditorContainer />
        <TagBoxContainer />
        <WriteActionButtonsContainer />
      </Responsive>
    </>
  );
};

export default WritePage;
