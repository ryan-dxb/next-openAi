import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import AppLayout from "../../components/AppLayout/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";

const Post = ({ content, title, description, keywords, ...rest }) => {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-screen-sm">
        <div className="mt-6 rounded-sm bg-stone-200 p-2 text-sm font-bold">
          SEO Title and Meta Description
        </div>
        <div className="my-2 rounded-md border border-stone-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{title}</div>
          <div className="mt-2">{description}</div>
        </div>

        <div className="mt-6 rounded-sm bg-stone-200 p-2 text-sm font-bold">
          Keywords
        </div>
        <div className="flex flex-wrap gap-1 pt-2 ">
          {keywords.split(",").map((keyword, i) => (
            <div key={i} className="rounded-md bg-slate-800 p-2 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-sm bg-stone-200 p-2 text-sm font-bold">
          Blog Post
        </div>
        <div dangerouslySetInnerHTML={{ __html: content || "" }} />
      </div>
    </div>
  );
};

Post.getLayout = (page, pageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);

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
        ...props,
      },
    };
  },
});

export default Post;
