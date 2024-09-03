import PasswordService from "../service/userServices/passwordService";
import * as bcrypt from "bcrypt";
import validator from "validator";

jest.mock("bcrypt");
jest.mock("validator");

describe('PasswordService tests', () => {
  const plainPassword = 'SenhaForte123!';
  const hashedPassword = '$12^#&@2%2';

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test("should generate a password hash correctly", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await PasswordService.hashPassword(plainPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    expect(result).toBe(hashedPassword);
  });

  test("should compare passwords", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
    const result = await PasswordService.comparePassword(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  test("should validate a strong password", async () => {
    (validator.isStrongPassword as jest.Mock).mockReturnValue(true);

    const result = PasswordService.validatePassword(plainPassword);

    expect(validator.isStrongPassword).toHaveBeenCalledWith(plainPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    });
    expect(result).toBe(true);
  });
})

