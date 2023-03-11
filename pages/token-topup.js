import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout/AppLayout";

const TokenTopUp = () => {
  return <div>TokenTopUp</div>;
};

TokenTopUp.getLayout = (page, pageProps) => {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {});

export default TokenTopUp;
