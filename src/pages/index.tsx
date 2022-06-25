import Router from "next/router";
import { CookieKeys } from "../utils/constant";
import { getCookie } from "../utils/cookieManager";

const Index = () => {
  if (getCookie(CookieKeys.token)) Router.push("/room");
  else Router.push("/auth/login");
  return null;
};

export default Index;
