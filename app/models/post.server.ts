import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    select: { title: true, content: true, slug: true },
    where: { slug },
  });
}

export async function createPost({
  title,
  slug,
  content,
}: {
  title: string;
  slug: string;
  content: string;
}) {
  return prisma.post.create({ data: { title, slug, content } });
}

export async function updatePost(
  slug: string,
  data: {
    title: string;
    slug: string;
    content: string;
  }
) {
  return prisma.post.update({
    where: { slug },
    data: { title: data.title, slug: data.slug, content: data.content },
  });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
