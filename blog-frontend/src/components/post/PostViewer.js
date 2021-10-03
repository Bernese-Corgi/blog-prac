import React from 'react';
import styled from 'styled-components';
import { palette } from '../../lib/styles';
import { Responsive } from '../common';

/**
 * 포스트 정보 보여주는 컴포넌트
 * 포스트 제목
 * 작성자 계정명
 * 작성된 시간
 * 태그
 * 제목
 * 내용
 */

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
`;

const SubInfo = styled.div`
  margin-top: 1rem;
  color: ${palette.gray[6]};

  /* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    color: ${palette.gray[5]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\B7'; /* 가운뎃점 문자 */
  }
`;

const Tags = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${palette.cyan[6]};
    }
  }
`;

const PostViewer = () => {
  return (
    <PostViewerBlock>
      <PostHead>
        <h1>제목</h1>
        <SubInfo>
          <span>
            <b>tester</b>
          </span>
          <span>{new Date().toLocaleDateString()}</span>
        </SubInfo>
        <Tags>
          <div className="tag">#태그1</div>
          <div className="tag">#태그2</div>
          <div className="tag">#태그3</div>
        </Tags>
      </PostHead>
      <PostContent
        // dangerouslySetInnerHTML: html을 적용할 때 사용하는 props
        dangerouslySetInnerHTML={{ __html: '<p>HTML <b>내용</b>입니다.</p>' }}
      />
    </PostViewerBlock>
  );
};

export default PostViewer;
