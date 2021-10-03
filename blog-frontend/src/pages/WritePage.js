import React from 'react';
import { Responsive } from '../components/common';
import { WriteActionButtons } from '../components/write';
import { EditorContainer, TagBoxContainer } from '../container/write';

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
