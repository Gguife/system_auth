import UserModel from '../../database/models/userModel';
import passwordService from './passwordService';
import LoginAttemptService from './loginAttemptService';


class AuthService {
  async authenticate(email: string, password: string, ipAddr: string) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) throw new Error("User not found.");

    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      LoginAttemptService.recordFailedAttempt(ipAddr);
      throw new Error('Invalid credentials!');
    }

    return user;
  }
}

export default new AuthService();