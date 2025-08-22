import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  // Tentukan tipe data untuk setiap item di frontmatter Markdown Anda
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string().transform((str) => new Date(str)), // Mengubah string tanggal menjadi objek Tanggal JavaScript
    // Anda bisa menambahkan item lain di sini jika perlu, misalnya: description: z.string(),
  }),
});

export const collections = {
  'blog': blogCollection,
};