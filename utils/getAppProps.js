import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";

export const getAppProps = async (context) => {
  const userSession = await getSession(context.req, context.res);

  const client = await clientPromise;

  const db = client.db("nextBlog_openai");

  const userProfile = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  });

  if (!userProfile) {
    return {
      availableTokens: 0,
      posts: [],
    };
  }

  const posts = await db
    .collection("posts")
    .find({
      postAuthorId: userProfile._id,
    })
    .sort({ postDate: -1 })
    .toArray();

  return {
    availableTokens: userProfile.availableTokens,
    posts: posts.map(({ postDate, _id, postAuthorId, ...rest }) => ({
      _id: _id.toString(),
      postAuthorId: postAuthorId.toString(),
      postDate: postDate.toString(),
      ...rest,
    })),
    postId: context.params?.postId || null,
  };
};
