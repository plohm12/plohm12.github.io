module.exports = {
  siteMetadata: {
    title: `What's Paul Brewing?`
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/
        }
      }
    }
  ]
};
