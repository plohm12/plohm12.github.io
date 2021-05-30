import path from "path";

process.env.REACT_STATIC_UNIVERSAL_PATH = path.join(__dirname, "react-universal-component/index.js");

export default () => ({
  webpack: (config, { stage }) => {
    if (stage === "prod") {
      config.resolve.alias["react-universal-component"] = path.join(__dirname, "react-universal-component/index.js");
    }
    return config;
  },
});