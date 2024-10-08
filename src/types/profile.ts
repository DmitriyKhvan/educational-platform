import { z } from 'zod';

export const addStudentSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type AddStudentSchema = z.infer<typeof addStudentSchema>;
