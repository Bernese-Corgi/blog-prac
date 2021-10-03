import React from 'react';
import { Responsive } from '../components/common';
import { TagBox, WriteActionButtons } from '../components/write';
import { EditorContainer } from '../container/write';

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBox />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
