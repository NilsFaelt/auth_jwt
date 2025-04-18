import bcrypt from "bcrypt";

export const hashMe = async (value: string, salt?: number): Promise<string> => {
  const hashedValue = await bcrypt.hash(value, salt ? salt : 0);
  return hashedValue;
};
