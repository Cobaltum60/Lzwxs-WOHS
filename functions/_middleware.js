export async function onRequest(context) {
  const { request, env, next } = context;
  const VALID_USER = env.AUTH_USER;
  const VALID_PASS = env.AUTH_PASS;

  // 安全校验：未配置账号密码直接报错
  if (!VALID_USER || !VALID_PASS) {
    return new Response('认证配置错误，请检查Cloudflare环境变量', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 解析当前访问的URL
  const url = new URL(request.url);
  
  // 放行登录页和验证接口（避免循环重定向）
  if (url.pathname === '/login.html' || url.pathname === '/api/verify-auth') {
    return next();
  }

  // 读取并验证Cookie中的认证信息
  const cookieHeader = request.headers.get('Cookie') || '';
  let isAuthorized = false;

  // 查找auth_token Cookie
  const authCookie = cookieHeader.split('; ').find(row => row.startsWith('auth_token='));
  if (authCookie) {
    try {
      const encodedToken = authCookie.split('=')[1];
      const decodedToken = atob(encodedToken);
      const [user, pass] = decodedToken.split(':');
      // 验证账号密码
      if (user === VALID_USER && pass === VALID_PASS) {
        isAuthorized = true;
      }
    } catch (e) {
      // 解析失败则认证无效
      isAuthorized = false;
    }
  }

  // 认证通过：放行访问
  if (isAuthorized) {
    return next();
  }

  // 认证失败：重定向到登录页（携带目标URL）
  const redirectTo = `${url.origin}/login.html?redirect=${encodeURIComponent(url.pathname + url.search)}`;
  return Response.redirect(redirectTo, 302);
}