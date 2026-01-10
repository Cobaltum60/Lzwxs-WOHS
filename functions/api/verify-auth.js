export async function onRequestPost(context) {
  const { env, request } = context;
  // 从环境变量取配置的账号密码
  const VALID_USER = env.AUTH_USER;
  const VALID_PASS = env.AUTH_PASS;

  // 未配置则返回错误
  if (!VALID_USER || !VALID_PASS) {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 解析前端传的账号密码
    const { username, password } = await request.json();
    // 验证
    if (username === VALID_USER && password === VALID_PASS) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }
}