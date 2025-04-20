import { z } from "zod";
export const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
  id: z.string().uuid(),
  created_at: z.date(),
});

export const PartialUserSchema = UserSchema.pick({
  username: true,
  password: true,
});

export type User = z.infer<typeof UserSchema>;
