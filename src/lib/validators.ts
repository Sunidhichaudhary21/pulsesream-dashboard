import { z } from 'zod';
import { ContentCategory, ContentType } from '../types/content';

export const categoriesEnum: [ContentCategory, ...ContentCategory[]] = [
  'technology',
  'business',
  'finance',
  'sports',
  'science',
  'entertainment',
  'health',
  'movies',
  'scifi',
  'action',
  'gaming',
  'design',
  'general',
];

export const contentTypesEnum: [ContentType, ...ContentType[]] = ['news', 'movie', 'social'];

export const preferenceFormSchema = z.object({
  selectedCategories: z.array(z.enum(categoriesEnum)).min(1, 'Select at least one category'),
  contentTypes: z.array(z.enum(contentTypesEnum)).min(1, 'Select at least one content type'),
  refreshInterval: z.number().min(0).max(600),
  layoutDensity: z.enum(['comfortable', 'compact']),
  autoPlayMedia: z.boolean(),
});

export type PreferenceFormValues = z.infer<typeof preferenceFormSchema>;

export const addPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(120, 'Title is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description is too long'),
  content: z.string().optional(),
  type: z.enum(contentTypesEnum),
  category: z.enum(categoriesEnum),
  imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  authorName: z.string().min(2, 'Author name is required'),
});

export type AddPostFormValues = z.infer<typeof addPostSchema>;
