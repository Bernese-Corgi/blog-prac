import Post from './models/post';

export default function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `post #${i}`,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam egestas tempus nibh vel ultricies. Ut sit amet diam ut ipsum cursus feugiat. Duis ac neque dolor. Sed dictum, ipsum iaculis feugiat tristique, mi mauris congue ligula, id aliquam quam est at ligula. Vivamus scelerisque velit felis, quis viverra sapien tempor sit amet. Sed aliquet, massa ac fermentum ultrices, lectus felis tempus augue, rhoncus vehicula dui erat vel nulla. Vivamus rhoncus lacus id augue sodales tristique. Integer vehicula aliquam magna vitae tincidunt. Nam massa massa, finibus sit amet eleifend bibendum, finibus nec nisl. Ut nibh libero, convallis vel erat rhoncus, luctus venenatis risus.',
    tags: ['fake', 'data'],
  }));

  /** insertMany(docs, options)
   * 하나 이상의 새 문서를 MongoDB 서버에 대한 단일 insertMany 호출로 삽입합니다.
   */
  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
