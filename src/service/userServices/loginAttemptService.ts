class LoginAttemptService {
  private failedLoginAttempts: { [key: string]: number } = {};
  private lockoutTime: { [key: string]: number } = {};
  private readonly maxAttempts: number = 5;
  private readonly lockoutDuration: number = 30 * 60 * 1000;

  recordFailedAttempt(email: string): void {
    this.failedLoginAttempts[email] = (this.failedLoginAttempts[email] || 0) + 1;

    if (this.failedLoginAttempts[email] >= this.maxAttempts) {
      this.lockoutTime[email] = Date.now() + this.lockoutDuration;
    }
  }

  isLockedOut(email: string): boolean {
    const lockoutExpiration = this.lockoutTime[email];
    if (lockoutExpiration && lockoutExpiration > Date.now()) {
      return true;
    }
    return false;
  }

  resetFailedAttempts(email: string): void {
    delete this.failedLoginAttempts[email];
    delete this.lockoutTime[email];
  }
}

export default new LoginAttemptService();