import { z } from 'zod';
import { ALL_CATEGORIES } from '@/lib/constants/mission-categories';

/**
 * Mission creation/update schema
 */
export const missionSchema = z
  .object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z
      .string()
      .min(10, 'La description doit contenir au moins 10 caractères'),
    category: z.string().min(1, 'La catégorie est obligatoire'),
    type: z.enum(['scheduled', 'ongoing'], {
      errorMap: () => ({ message: 'Type de mission invalide' }),
    }),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().min(3, 'Le lieu doit contenir au moins 3 caractères'),
    maxVolunteers: z
      .number()
      .min(1, 'Il doit y avoir au moins 1 bénévole')
      .max(100, 'Maximum 100 bénévoles par mission'),
    isUrgent: z.boolean().default(false),
    isRecurrent: z.boolean().default(false),
    status: z
      .enum(['draft', 'published', 'full', 'cancelled', 'completed'])
      .default('draft'),
  })
  .refine(
    (data) => {
      // If mission is scheduled, dates are required
      if (data.type === 'scheduled') {
        return data.startDate && data.endDate;
      }
      return true;
    },
    {
      message:
        'Les dates de début et de fin sont requises pour une mission planifiée',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      // If both dates are provided, endDate must be after startDate
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: 'La date de fin doit être après la date de début',
      path: ['endDate'],
    }
  );

export type MissionInput = z.infer<typeof missionSchema>;

