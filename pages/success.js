import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";

const Success = () => {
  return (
    <div>
      <h1>Thank you for your purchase!</h1>
    </div>
  );
};

Success.getLayout = (page, pageProps) => {
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

export default Success;
