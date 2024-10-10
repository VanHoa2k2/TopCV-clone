export async function POST(request: Request) {
  const body = await request.json();
  const access_token = body.accessToken as string;
  const refresh_token = body.refreshToken as string;
  if (!access_token || !refresh_token) {
    return new Response(
      JSON.stringify({
        message: "Không nhận được access token hoặc refresh token",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );
  headers.append(
    "Set-Cookie",
    `refresh_token=${refresh_token}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );

  return new Response(JSON.stringify(body), {
    status: 200,
    headers,
  });
}
