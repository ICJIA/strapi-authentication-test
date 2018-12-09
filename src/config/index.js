const config = {
  api: {
    baseApi: "https://strapidev.icjia-api.cloud",
    baseClient: "https://strapi-auth.netlify.com",
    forgetPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resetPasswordCallback: "/reset",
    posts: "/posts",
    login: "/auth/local"
  }
};

export default config;
