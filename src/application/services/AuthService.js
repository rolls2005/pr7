const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signUp(userData) {
    return await this.userRepository.createUser(userData);
  }

  async signIn(userData) {
    const { username, password } = userData;

    const user = await this.userRepository.getUserByUsername(username);

    if (!user || user.password !== password) {
      return { error: "Invalid username or password" };
    }

    const accessToken = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      const user = await this.userRepository.getUserById(decoded.id);

      if (!user) {
        return { error: "Invalid refresh token" };
      }

      const accessToken = jwt.sign(
        {
          id: decoded.id,
        },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      return accessToken;
    } catch (err) {
      return { error: "Invalid refresh token" };
    }
  }
}

module.exports = AuthService;
