import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  // Tentukan tipe data untuk setiap item di frontmatter Markdown Anda
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string().transform((str) => new Date(str)),
    // Menambahkan .optional() membuat properti ini tidak wajib
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};