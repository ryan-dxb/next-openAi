import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";

const TokenTopUp = () => {
  const handleClick = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    console.log("TokenTopUp", json);

    window.location.href = json.session.url;
  };

  return (
    <div>
      <h1></h1>
      <button className="green-button" onClick={handleClick}>
        Add Tokens
      </button>
    </div>
  );
};

TokenTopUp.getLayout = (page, pageProps) => {
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

export default TokenTopUp;
