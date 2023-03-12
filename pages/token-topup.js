import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout/AppLayout";

const TokenTopUp = () => {
  const handleClick = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export const getServerSideProps = withPageAuthRequired(() => {});

export default TokenTopUp;
