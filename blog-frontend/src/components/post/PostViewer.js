import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { palette } from '../../lib/styles';
import Responsive from '../common/Responsive';
import { SubInfo, Tags } from '../common';

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

const PostViewer = ({ post, error, loading, actionButtons }) => {
  /* 에러 발생 시 -------------------------------- */
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생</PostViewerBlock>;
  }

  /* 로딩 중이거나 포스트 데이터가 아직 없을 때 ------------------------ */
  if (loading || !post) {
    return null;
  }

  const { title, body, user, publishedDate, tags } = post;

  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} - JBLOG</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          username={user.username}
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags} />
      </PostHead>
      {actionButtons}
      <PostContent
        // dangerouslySetInnerHTML: html을 적용할 때 사용하는 props
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </PostViewerBlock>
  );
};

export default PostViewer;
