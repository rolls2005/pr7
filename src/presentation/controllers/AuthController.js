const UserRepository = require("../../infrastructure/repositories/UserRepository");
const AuthService = require("../../application/services/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService(UserRepository);
  }

  async signUp(request, reply) {
    await this.authService.signUp(request.body);

    reply.send({ message: "User created successfully!" });
  }

  async signIn(request, reply) {
    const tokens = await this.authService.signIn(request.body);

    if (tokens.error) {
      return reply.status(401).send({ error: tokens.error });
    }

    reply
      .setCookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/api",
      })
      .send({ accessToken: tokens.accessToken });
  }

  async logOut(request, reply) {
    reply
      .clearCookie("refreshToken", { path: "/api" })
      .send({ message: "User logged out successfully!" });
  }

  async refresh(request, reply) {
    const { refreshToken } = request.cookies;

    const accessToken = await this.authService.refresh(refreshToken);

    reply.send({ accessToken });
  }
}

module.exports = AuthController;
