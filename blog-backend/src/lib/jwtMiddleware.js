import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = async (ctx, next) => {
  // get token
  const token = ctx.cookies.get('access_token');

  // 토큰이 없으면 다음 미들웨어 실행
  if (!token) return next();

  try {
    /** verify(token, secretOrPublicKey[, options])
     * 디코딩된 토큰을 얻기 위해 비밀 또는 공개 키를 사용하여 주어진 토큰을 동기적으로 확인
     * @param token 확인할 JWT 문자열
     * @param secretOrPublicKey HMAC 알고리즘의 비밀 또는 RSA 및 ECDSA의 PEM 인코딩 공개 키입니다.
     * @param options 검증을 위한 옵션
     * @returns 디코딩된 토큰
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    /* decoded를 console.log로 출력하면 다음 객체가 출력된다.
    {
      _id: '6153f88e644379fb557b5bc2',
      username: 'sijung',
      iat: 1632893070, // iat: 토큰 발행 날짜
      exp: 1633497870 // exp: 토큰 만료 날짜
    }
    */
    // 해석된 결과(decoded)를 ctx의 state에 넣는다.
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    // 토큰 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      // 토큰의 남은 유효 기간이 3.5일 미만인 경우 재발급
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
        httpOnly: true,
      });
    }

    // 모든 처리 완료 후 다음 미들웨어 실행
    return next();
  } catch (e) {
    // 토큰 검증 실패 시 다음 미들웨어 실행
    return next();
  }
};

export default jwtMiddleware;
