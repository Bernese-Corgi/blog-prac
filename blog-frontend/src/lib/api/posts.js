import client from './client';

/* 포스트 작성 --------------------------------- */
export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

/* 특정 포스트 조회 ------------------------------- */
export const readPost = (id) => client.get(`/api/posts/${id}`);
