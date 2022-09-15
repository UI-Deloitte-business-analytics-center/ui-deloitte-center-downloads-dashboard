import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler(process.env.APP_PROTECT_PASSWORD, {
  cookieName: "authorization",
});
