import client from './client';
import qs from 'qs';

/* 포스트 작성 --------------------------------- */
export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

/* 특정 포스트 조회 ------------------------------- */
export const readPost = (id) => client.get(`/api/posts/${id}`);

/* 포스트 목록 조회 ------------------------------- */
export const listPosts = ({ page, username, tag }) => {
  // listPosts API를 호출할 때 파라미터로 값을 넣어 주면
  // /api/posts?username=tester&page=2와 같이 주소를 만들어서 호출한다.
  const queryString = qs.stringify({ page, username, tag });
  return client.get(`/api/posts?${queryString}`);
};

/* 포스트 수정 --------------------------------- */
export const updatePost = ({ id, title, body, tags }) =>
  client.patch(`/api/posts/${id}`, { title, body, tags });

/* 포스트 삭제 --------------------------------- */
export const removePost = (id) => client.delete(`/api/posts/${id}`);
