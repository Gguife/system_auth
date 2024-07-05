import * as bcrypt from 'bcrypt';
import validator from 'validator';

const saltRounds = 10;

class UserService {
  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  validatePassword(password: string): boolean {
    const isStrong = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })

    return isStrong;
  }
}

export default new UserService();