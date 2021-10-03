import React from 'react';
import { Responsive } from '../components/common';
import {
  EditorContainer,
  TagBoxContainer,
  WriteActionButtonsContainer,
} from '../container/write';

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtonsContainer />
    </Responsive>
  );
};

export default WritePage;
