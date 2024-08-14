import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../../redisClient";


class LoginAttemptService {
  private readonly maxWrongAttemptsByIPperMinute = 5;
  private readonly maxWrongAttemptsByIPperDay = 100;
  
  private limiterFastBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_minute',
    points: this.maxWrongAttemptsByIPperMinute,
    duration: 60,
  })

  private limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_day',
    points: this.maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24,
  })

  async isLockedOut(ipAddr: string): Promise<boolean>{
    const resSlow = await this.limiterSlowBruteByIP.get(ipAddr);
    return resSlow !== null && resSlow.consumedPoints > this.maxWrongAttemptsByIPperDay;
  }



  async recordFailedAttempt(ipAddr: string): Promise<void> {
    try{
      await Promise.all([
        this.limiterFastBruteByIP.consume(ipAddr, 1),
        this.limiterSlowBruteByIP.consume(ipAddr, 1)
      ])
    }catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during authentication:", {
          message: error.message,
          stack: error.stack,
          details: error
        });
      } else {
        console.error("Unexpected error during authentication:", {error});
      }
    }
  }
}


export default new LoginAttemptService();