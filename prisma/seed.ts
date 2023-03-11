import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "how-to-use-bing-chat-mode",
      title: "How to use Bing chat mode",
      content:
        "Bing chat mode is a new feature that lets you interact with Bing in a conversational way. You can ask questions, get answers, and explore topics using natural language. You can also generate creative content such as poems, stories, code, and more.\n\nTo use Bing chat mode, simply type your message in the chat box and press enter. Bing will reply with a relevant and engaging response. You can also use voice input by clicking on the microphone icon.\n\nBing chat mode is powered by advanced AI that understands your intent and context. It can also provide suggestions for the next user turn to help you continue the conversation.\n\nBing chat mode is currently available in English and supports a variety of domains such as weather, news, entertainment, travel, education, and more. You can switch back to the regular search mode by clicking on the magnifying glass icon.\n\nTry Bing chat mode today and discover a new way to search!",
    },
    {
      slug: "best-places-to-visit-in-europe",
      title: "Best places to visit in Europe",
      content:
        "Europe is a continent full of history, culture, and natural beauty. Whether you are looking for a romantic getaway, a family adventure, or a solo trip, there is something for everyone in Europe.\n\nHere are some of the best places to visit in Europe:\n\n- Paris: The city of love and lights is a must-see for anyone who loves art, architecture, fashion, and food. You can admire the iconic Eiffel Tower, explore the Louvre Museum, stroll along the Champs-Élysées, or enjoy a croissant at a café.\n- Rome: The eternal city is a treasure trove of ancient monuments, stunning churches, and lively piazzas. You can visit the Colosseum, Vatican City, Trevi Fountain, or taste some authentic pizza and gelato.\n- Barcelona: The capital of Catalonia is a vibrant and colorful city that combines modern design with Gothic charm. You can marvel at the Sagrada Familia, wander through Park Güell, or relax on the beach.\n- London: The cosmopolitan city of London offers something for everyone. You can see Big Ben, Buckingham Palace, the Tower of London, or shop at Oxford Street. You can also enjoy the diverse culture, music, and cuisine of London.",
    },
    {
      slug: "tips-for-writing-better-blog-posts",
      title: "Tips for writing better blog posts",
      content:
        "Blog posts are a great way to share your ideas, knowledge, and opinions with your audience. They can also help you establish your authority, build your brand, and drive traffic to your website.  n  nHowever, writing good blog posts is not easy. You need to craft engaging headlines, write clear and concise content, and optimize your posts for SEO. Here are some tips for writing better blog posts:  n - Know your audience: Before you start writing, you need to know who you are writing for. What are their needs, interests, and pain points ? What kind of tone and style do they prefer ? How do they consume content ? Knowing your audience will help you tailor your message and make it more relevant and appealing. ",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      create: post,
      update: post,
      where: { slug: post.slug },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
