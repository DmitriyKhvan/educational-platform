import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password_not_match',
  });

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
