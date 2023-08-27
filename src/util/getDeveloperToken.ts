import jwt from "jsonwebtoken";

export const getDeveloperToken = () => {
  const TEAM_ID = process.env.TEAM_ID;
  const KEY_ID = process.env.KEY_ID;
  const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

  const token = jwt.sign({}, PRIVATE_KEY.replace(/\\n/g, "\n"), {
    algorithm: "ES256",
    expiresIn: "180d",
    issuer: TEAM_ID,
    header: {
      alg: "ES256",
      kid: KEY_ID,
    },
  });
  return token;
};
