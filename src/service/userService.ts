import * as bcrypt from 'bcrypt';
import validator from 'validator';

const saltRounds = 10;

class UserService {
  private failedLoginAttempts: { [key: string]: number } = {};
  private lockoutTime: { [key: string]: number } = {};
  private readonly maxAttempts: number = 5;
  private readonly lockoutDuration: number = 30 * 60 * 1000; 


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

  recordFailedAttempt(email: string): void {
    this.failedLoginAttempts[email] = (this.failedLoginAttempts[email] || 0) + 1;
  
    if(this.failedLoginAttempts[email] >= this.maxAttempts){
      this.lockoutTime[email] = Date.now() + this.lockoutDuration;
      this.failedLoginAttempts[email];
    }
  }

  isLockedOut(email: string): { locked: boolean, timeReamining?: number } {
    const lockoutExpiration = this.lockoutTime[email];
    if(lockoutExpiration > Date.now()){
      return {locked: true, timeReamining: lockoutExpiration - Date.now()}
    }
    return {locked: false};
  }
}

export default new UserService();