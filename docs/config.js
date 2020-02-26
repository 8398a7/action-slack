const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'http://localhost:8080',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo:
      'https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/favicon.png',
    logoLink: 'https://learn.hasura.io',
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
    forcedNavOrder: ['/with', '/advanced', '/next_action', '/contributors'],
    collapsedNav: [
      '/advanced', // add trailing slash if enabled above
    ],
    links: [{ text: 'GitHub', link: 'https://github.com/8398a7/action-slack' }],
    frontline: false,
    ignoreIndex: true,
  },
  siteMetadata: {
    title: 'action-slack | 8398a7',
    description: 'Documentation built with mdx. Powering learn.hasura.io ',
    ogImage: null,
    docsLocation:
      'https://github.com/8398a7/action-slack/tree/master/docs/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
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
