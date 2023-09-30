import {z} from 'zod';

export const createSessionInputSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password should be 6 characters minimum'),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;
