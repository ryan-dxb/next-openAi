import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useState } from "react";
import AppLayout from "../../components/AppLayout/AppLayout";

const NewPost = () => {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        keywords,
      }),
    });

    const data = await response.json();

    if (data?.postId) {
      router.push(`/post/${data.postId}`);
    }
  };

  return (
    <div>
      <form type="submit" action="">
        <div>
          <label htmlFor="">
            <strong>Generate a blog post about the topic of:</strong>
          </label>
          <textarea
            className="my-2 block w-full resize-none rounded-sm border-slate-500 px-4 py-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="my-2 block w-full resize-none rounded-sm border-slate-500 px-4 py-2"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <button className="green-button" onClick={handleSubmit}>
          Generate Blog Post
        </button>
      </form>
    </div>
  );
};

NewPost.getLayout = (page, pageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);

    return {
      props: {
        ...props,
      },
    };
  },
});

export default NewPost;
