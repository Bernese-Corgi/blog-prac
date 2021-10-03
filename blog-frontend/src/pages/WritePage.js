import React from 'react';
import { Responsive } from '../components/common';
import { Editor, TagBox, WriteActionButtons } from '../components/write';

const WritePage = () => {
  return (
    <Responsive>
      <Editor />
      <TagBox />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
