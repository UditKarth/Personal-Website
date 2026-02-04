import { defineCollection, z } from 'astro:content';

const writingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    status: z.enum(['seedling', 'budding', 'evergreen']),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    image: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    githubUrl: z.string().url().optional(),
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

