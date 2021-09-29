import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* ----------------------------------- 스키마 ---------------------------------- */
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

/* -------------------------------- 인스턴스 메서드 -------------------------------- */
/** setPassword(password) (커스텀 인스턴스 메서드)
 * 비밀번호를 인수로 받아 계정의 hashedPassword 값 설정
 * @param password 해싱할 비밀번호
 */
UserSchema.methods.setPassword = async function (password) {
  // 함수 내부에서 this에 접근해야 하기 때문에 function 키워드 사용해야 한다.
  const hash = await bcrypt.hash(password, 10);
  // this : 문서 인스턴스
  this.hashedPassword = hash;
};

/** checkPassword(password) (커스텀 인스턴스 메서드)
 * 인수로 받은 비밀번호가 해당 계정의 비밀번호와 일치하는지 검증
 * @param password 해당 계정과 일치하는지 확인할 비밀번호
 * @returns boolean
 */
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

/** serialize()
 * hashedPassword 필드가 응답되지 않도록 데이터를 JSON으로 변환 후 delete로 해당 필드 삭제
 * @returns hashedPassword 필드를 삭제한 데이터
 */
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

/** generateToken()
 * 토큰을 생성하는 메서드
 * @returns 생성된 토큰
 */
UserSchema.methods.generateToken = function () {
  /** sign(payload, secretOrPrivateKey[, options])
   * 지정된 페이로드를 JSON 웹 토큰 문자열 페이로드에 동기적으로 서명합니다.
   * @param payload 서명할 페이로드. 리터럴, 버퍼, 문자열
   * @param secretOrPrivateKey JWT 암호. HMAC 알고리즘에 대한 비밀 또는 RSA 및 ECDSA에 대해 PEM으로 인코딩된 개인 키
   * @param [options] 서명 반환 옵션
   */
  const token = jwt.sign(
    { _id: this.id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' /*7일동안 유효*/ },
  );
  return token;
};

/* --------------------------------- 정적 메서드 --------------------------------- */
/** findByUsername(username)
 * username으로 데이터를 찾을 수 있다
 * @param username 데이터를 찾을 username
 * @returns 데이터
 */
UserSchema.statics.findByUsername = function (username) {
  // this : 모델 (User)
  return this.findOne({ username });
};

/* ---------------------------------- 모델 생성 --------------------------------- */
const User = mongoose.model('User', UserSchema);

export default User;
