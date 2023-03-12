import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import AppLayout from "../../components/AppLayout/AppLayout";

const Post = ({ content, title, description, keywords }) => {
  return <div>Post</div>;
};

Post.getLayout = (page, pageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res, query } = context;
    const { user } = await getSession(req, res);

    const client = await clientPromise;

    const db = client.db("nextBlog_openai");

    const userProfile = await db.collection("users").findOne({
      auth0Id: user.sub,
    });

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(query.postId),
      postAuthorId: userProfile._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        content: post.postContent,
        title: post.postTitle,
        description: post.postDescription,
        keywords: post.postKeywords,
      },
    };
  },
});

export default Post;
