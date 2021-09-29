import Joi from 'joi';
import User from '../../models/user';

/* -------------------------------- 회원 인증 API ------------------------------- */
/* 회원 가입 --------------------------------- */
// POST /api/auth/register { username: '', password: '' }
export const register = async (ctx) => {
  // Request Body 검증 - 스키마
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  // Request Body 검증 - 검증 함수 호출
  const result = schema.validate(ctx.request.body);
  // Request Body 검증 - 오류 발생 시 처리
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;

  try {
    // username이 존재하는지 확인
    const exists = await User.findByUsername(username);

    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    // user 인스턴스 생성
    const user = new User({ username });

    // 비밀번호 설정
    await user.setPassword(password);
    // 데이터 베이스에 저장
    await user.save();

    // hashedPassword 필드가 제거되어 응답된 데이터
    const data = user.serialize();

    // 토큰 발행
    const token = user.generateToken();
    // 토큰을 쿠키에 담기
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });

    ctx.body = data;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 로그인 ---------------------------------- */
// POST /api/auth/login { username: '', password: '' }
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  // username, password가 없으면 에러 처리
  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    // username으로 계정 찾아서 해당하는 계정 데이터 반환
    const user = await User.findByUsername(username);
    // 계정이 존재하지 않으면 에러 처리
    if (!user) {
      ctx.status = 401;
      return;
    }

    // <- 계정이 유효하면 아래 코드 실행 ->

    // password가 위에서 찾은 user 계정 데이터와 일치하는지 확인
    // 비밀번호가 일치하면 계정 정보를 응답한다.
    const valid = await user.checkPassword(password);
    // 비밀번호가 일치하지 않으면 에러 처리
    if (!valid) {
      ctx.status = 401;
      return;
    }

    // hashedPassword 필드를 삭제한 데이터 반환
    ctx.body = user.serialize();

    // 토큰 발행
    const token = user.generateToken();
    // 토큰을 쿠키에 담기
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 로그인 상태 확인 ------------------------------- */
// GET /api/auth/check
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401; // Unathorized
    return;
  }
  ctx.body = user;
};

/* 로그아웃 ---------------------------------- */
export const logout = async (ctx) => {
  //
};
