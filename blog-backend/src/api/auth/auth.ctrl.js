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

    ctx.body = data;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 로그인 ---------------------------------- */
export const login = async (ctx) => {
  //
};

/* 로그인 상태 확인 ------------------------------- */
export const check = async (ctx) => {
  //
};

/* 로그아웃 ---------------------------------- */
export const logout = async (ctx) => {
  //
};
