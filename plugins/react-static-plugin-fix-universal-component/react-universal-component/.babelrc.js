module.exports = {
  sourceType: "unambiguous",
  presets: ["react-static/babel-preset.js"],
  plugins: [
    [
      require.resolve("@babel/plugin-transform-runtime"),
      {
        corejs: false,
        useESModules: true,
      },
    ],
    require.resolve("@babel/plugin-syntax-dynamic-import"),
  ],
};