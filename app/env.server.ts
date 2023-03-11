import invariant from "tiny-invariant";

export function getEnv() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  invariant(ADMIN_EMAIL, "required ADMIN_EMAIL environment variable");
  return {
    ADMIN_EMAIL,
  };
}