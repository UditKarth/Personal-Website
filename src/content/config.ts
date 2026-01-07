import { defineCollection, z } from 'astro:content';

const writingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    status: z.enum(['seedling', 'budding', 'evergreen']),
    tags: z.array(z.string()).default([]),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    githubUrl: z.string().url(),
    techStack: z.array(z.string()),
    publishDate: z.coerce.date(),
    image: z.string().optional(),
    demoUrl: z.string().url().optional(),
  }),
});

export const collections = {
  'writings': writingsCollection,
  'projects': projectsCollection,
};

