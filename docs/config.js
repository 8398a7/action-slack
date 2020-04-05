const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://action-slack.netlify.com',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '',
    logoLink: '',
    title: 'action-slack',
    githubUrl: 'https://github.com/8398a7/action-slack',
    helpUrl: '',
    tweetText: '',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/usage',
      '/with',
      '/migration',
      '/usecase',
      '/contributors',
    ],
    collapsedNav: [
      '/usecase', // add trailing slash if enabled above
      '/migration',
    ],
    links: [{ text: 'GitHub', link: 'https://github.com/8398a7/action-slack' }],
    frontline: false,
    ignoreIndex: true,
  },
  siteMetadata: {
    title: 'action-slack | 8398a7',
    description: '',
    ogImage: null,
    docsLocation:
      'https://github.com/8398a7/action-slack/tree/master/docs/content',
    favicon: 'This is the action-slack documentation site.',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: '8398a7@action-slack',
      short_name: 'action-slack',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
