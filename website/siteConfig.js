// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
    title: 'MobX State Router', // Title for your website.
    tagline: 'MobX Powered Router for React Apps',
    url: 'https://nareshbhatia.github.io', // Your website URL
    baseUrl: '/mobx-state-router/', // Base URL for your project */
    // For github.io type URLs, you would set the url and baseUrl like:
    //   url: 'https://facebook.github.io',
    //   baseUrl: '/test-site/',

    // Used for publishing and more
    projectName: 'mobx-state-router',
    organizationName: 'nareshbhatia',
    // For top-level user or org sites, the organization is still the same.
    // e.g., for the https://JoelMarcey.github.io site, it would be set like...
    //   organizationName: 'JoelMarcey'

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [
        { doc: 'guides-getting-started', label: 'Docs' },
        {
            href: 'https://github.com/nareshbhatia/mobx-state-router',
            label: 'GitHub'
        }
        // { page: 'help', label: 'Help' },
        // { blog: true, label: 'Blog' },
    ],

    // If you have users set above, you add it here:
    // users,

    /* path to images for header/footer */
    headerIcon: 'img/mobx-logo.png',
    footerIcon: 'img/mobx-logo.png',
    favicon: 'img/mobx-logo.png',

    /* Colors for website */
    colors: {
        primaryColor: '#383838',
        secondaryColor: '#DE5E26'
    },

    /* Custom fonts for website */
    /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

    // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
    copyright: `Copyright © ${new Date().getFullYear()} Naresh Bhatia`,

    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks.
        theme: 'atom-one-dark'
    },

    // Add custom scripts here that would be placed in <script> tags.
    scripts: ['https://buttons.github.io/buttons.js'],

    // On page navigation for the current documentation page.
    onPageNav: 'separate',
    // No .html extensions for paths.
    cleanUrl: true,

    // Open Graph and Twitter card images.
    ogImage: 'img/mobx-logo.png',
    twitterImage: 'img/mobx-logo.png',

    // Show documentation's last contributor's name.
    // enableUpdateBy: true,

    // Show documentation's last update time.
    // enableUpdateTime: true,

    // You may provide arbitrary config keys to be used as needed by your
    // template. For example, if you need your repo's URL...
    //   repoUrl: 'https://github.com/facebook/test-site',
    githubUrl: 'https://github.com/nareshbhatia/mobx-state-router',
    liveDemoUrl: 'https://mobx-shop.firebaseapp.com',
    srpUrl: 'https://en.wikipedia.org/wiki/Single_responsibility_principle',
    mwArticleUrl: 'https://hackernoon.com/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37'
};

module.exports = siteConfig;
