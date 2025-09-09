export const config = () => ({
  at_secret: process.env.AT_JWT_SECRET,
  at_exp: process.env.AT_EXPIRES_IN,
  rt_secret: process.env.RT_JWT_SECRET,
  rt_exp: process.env.RT_EXPIRES_IN,
});
