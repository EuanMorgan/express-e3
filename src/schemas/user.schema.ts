import {z} from 'zod';

export const createUserInputSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
        })
        .min(1)
        .max(255),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, 'Password should be 6 characters minimum')
        .max(255),
      passwordConfirmation: z.string(),
    })
    .refine(data => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
    }),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
