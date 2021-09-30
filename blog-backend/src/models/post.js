import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

/** mongoose.model(name [, schema, collection, skipInit])
 * @param name : 스키마 이름
 * @param schema : 스키마 객체
 * @param collection : 원하는 컬렉션 이름 작성
 * 데이터베이스는 스키마 이름을 정하면, 그 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만든다. (스키마 이름 Post -> 컬렉션 이름 posts)
 */
const Post = mongoose.model('Post', PostSchema);
export default Post;
