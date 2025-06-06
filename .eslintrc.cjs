// .eslintrc.cjs
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  globals: {
    process: "readonly",
    global: "readonly",
  },
  rules: {
    "no-process-exit": "off",
  },
};
