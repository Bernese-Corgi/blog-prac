import React from 'react';
import { Responsive } from '../components/common';
import { Editor, TagBox } from '../components/write';

const WritePage = () => {
  return (
    <Responsive>
      <Editor />
      <TagBox />
    </Responsive>
  );
};

export default WritePage;
