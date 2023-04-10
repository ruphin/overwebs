const FILE_EXT_REGEX = /\.\w+$/;

export default {
  nodeResolve: true,
  watch: true,
  port: 5000,
  middleware: [
    function rewriteIndex(context, next) {
      if (!FILE_EXT_REGEX.test(context.url)) {
        context.url = "/index.html";
      }

      return next();
    },
  ],
};
