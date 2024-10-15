import { GetServerSideProps } from "next";
import nookies from "nookies";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = nookies.get(context);
  const token = cookies.token || null;

  return {
    props: {
      initialLoggedIn: !!token,
    },
  };
};
