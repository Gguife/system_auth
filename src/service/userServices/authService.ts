import UserModel from '../../database/models/userModel';
import passwordService from './passwordService';
import loginAttemptService from './loginAttemptService';


class AuthService {
  async authenticate(email: string, password: string) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) throw new Error("User not found.");
    if (loginAttemptService.isLockedOut(email)) throw new Error('Too many login attempts.');

    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      loginAttemptService.recordFailedAttempt(email);
      throw new Error('Invalid credentials!');
    }

    loginAttemptService.resetFailedAttempts(email);
    return user;
  }
}

export default new AuthService();