import { z } from 'zod';

/**
 * User registration schema
 */
export const userRegistrationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Numéro de téléphone invalide'
    ),
  consentDataProcessing: z.literal(true, {
    errorMap: () => ({
      message: 'Vous devez accepter le traitement de vos données personnelles',
    }),
  }),
  consentCommunications: z.boolean().default(false),
});

/**
 * User profile update schema
 */
export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Numéro de téléphone invalide'
    ),
  notificationPreferences: z
    .object({
      email: z.boolean(),
      sms: z.boolean(),
    })
    .optional(),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

