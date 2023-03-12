import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);

  const client = await clientPromise;

  const db = client.db("nextBlog_openai");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    return res.status(403).json({ message: "Not enough tokens" });
  }

  const { topic, keywords } = req.body;

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  // const topic = "Top 10 tips for dog owners";
  // const keywords = [
  //   "dog",
  //   "pet",
  //   "owner",
  //   "tips",
  //   "training",
  //   "first time dog owners, common dog health issues, best dog breeds",
  // ];

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0.9, // 0 = Low Richness / Identical for each same prompt, 1 = High Richness
    max_tokens: 3600, //  1 token = 4 characters including spaces and prompt
    prompt: `Write a long and detailed SEO friendly blog post about the topic of your choice. The post should be at least 1000 words long and should contain at least 5 subheadings. The post should be written on ${topic}. The post should target the following comma-seperated keywords: ${keywords}.
    The content should be formatted in SEO friendly HTML. The response must also include appropriate HTML tags for the title, meta description, and semantic HTML tags for the headings and paragraphs.
    The return format must be stringified JSON in the following format:
    {
      "title": "The title of the blog post",
      "description": "The meta description of the blog post",
      "content": "The HTML content of the blog post"
      
    }
    `,
  });

  console.log(response);

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  console.log(response.data.choices[0]);

  const parsedResponse = JSON.parse(
    response.data.choices[0]?.text.split("\n").join("")
  );

  const post = await db.collection("posts").insertOne({
    postContent: parsedResponse?.content,
    postTitle: parsedResponse?.title,
    postDescription: parsedResponse?.description,
    postKeywords: keywords,
    postTopic: topic,
    postAuthorId: userProfile._id,
    postDate: new Date(),
  });

  res.status(200).json({
    postId: post.insertedId,
  });
});
