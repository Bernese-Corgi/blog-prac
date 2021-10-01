const checkLoggedIn = (ctx, next) => {
  // 로그인 상태가 아니라면 401 HTTP Status 반환
  if (!ctx.state.user) {
    ctx.status = 401; // Unauthorized
    // 로그인 상태면 그 다음 미들웨어를 실행한다.
    return next();
  }
};

export default checkLoggedIn;
