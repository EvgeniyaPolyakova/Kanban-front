import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import LoginForm from "../components/LoginForm";

const Login: NextPage = () => {
  return (
    <>
      <Layout>
        <LoginForm />
      </Layout>
    </>
  );
};

export default Login;
