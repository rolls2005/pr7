const assert = require("assert");
const { describe, it } = require("node:test");

const AuthService = require("../../src/application/services/AuthService");

const mockUserRepository = {
  getUserById: async (id) => {
    if (id === "1") {
      return {
        _id,
        username: "test11",
        password: "123123",
      };
    }
    return null;
  },
  getUserByUsername: async (username) => {
    if (username === "test11") {
      return {
        _id: "1",
        username,
        password: "123123",
      };
    }
    return null;
  },
};

const authService = new AuthService(mockUserRepository);

describe("AuthService", () => {
  describe("signIn", () => {
    it("should return tokens if user exists", async () => {
      const userData = { username: "test11", password: "123123" };

      const tokens = await authService.signIn(userData);

      assert.ok(!tokens.error, "Tokens should be returned");
    });

    it("should return error if user doesn't exist", async () => {
      const userData = { username: "nonExistUser", password: "321331" };

      const tokens = await authService.signIn(userData);

      assert.ok(tokens.error, "Error should be returned");
    });
  });

  describe("refresh", () => {
    it("should return access token when refresh token is valid", async () => {
      const userData = { username: "test11", password: "123123" };

      const tokens = await authService.signIn(userData);

	  const accessToken = await authService.refresh(tokens.refreshToken);

	  assert.ok(accessToken, "Access token should be returned");
    });

	it("should return error when token is not valid", async () => {
		const accessToken = await authService.refresh("notValidToken");

		assert.ok(accessToken.error, "Error should be returned");
	})
  });
});
