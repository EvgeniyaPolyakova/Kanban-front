import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import s from "../styles/auth.module.scss";

const Auth: NextPage = () => {
  return (
    <>
      <Layout>
        <RegisterForm />
      </Layout>
    </>
  );
};

export default Auth;
