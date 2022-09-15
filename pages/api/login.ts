import { loginHandler } from "next-password-protect";

export default loginHandler(process.env.APP_PROTECT_PASSWORD, {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
