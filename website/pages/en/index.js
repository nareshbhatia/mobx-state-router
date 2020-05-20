const React = require('react');

const GETTING_STARTED = 'guides-getting-started.html';

const getDocUrl = (siteConfig, language, doc) => {
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
};

const getImgUrl = (siteConfig, src) => {
    const { baseUrl } = siteConfig;
    return `${baseUrl}img/${src}`;
};

const Image = ({ src, alt }) => (
    <p>
        <a target="_blank" rel="noopener noreferrer" href={src}>
            <img src={src} alt={alt} />
        </a>
    </p>
);

const HomeSplash = ({ siteConfig, language }) => {
    const { liveDemoUrl } = siteConfig;
    const docUrl = (doc) => getDocUrl(siteConfig, language, doc);

    const Button = (props) => (
        <div className="toolbar__element">
            <a
                className="button button--reverse"
                href={props.href}
                target={props.target}
            >
                {props.children}
            </a>
        </div>
    );

    return (
        <div className="hero">
            <div className="text">
                <strong>{siteConfig.title}</strong>
            </div>
            <div className="minitext">{siteConfig.tagline}</div>
            <div className="toolbar">
                <Button href={docUrl(GETTING_STARTED)}>Get Started</Button>
                <Button href={liveDemoUrl}>Live Demo</Button>
            </div>
        </div>
    );
};

const Features = () => (
    <React.Fragment>
        <h2>Features</h2>
        <ul>
            <li>
                State is decoupled from the UI. UI is simply a function of the
                state.
            </li>
            <li>
                UI is no longer responsible for fetching data. Data is now
                fetched during state transitions using router hooks.
            </li>
            <li>
                The router can override routing requests based on the
                application state. For example, it can redirect to the Sign In
                page if the user is not logged in.
            </li>
            <li>
                Supports
                <ul>
                    <li>404 (Not Found) errors</li>
                    <li>Server-Side Rendering</li>
                </ul>
            </li>
        </ul>
    </React.Fragment>
);

const Motivation = ({ siteConfig }) => (
    <React.Fragment>
        <h2>Motivation: Decouple State and UI</h2>
        <p>
            The motivation to write mobx-state-router came from the frustration
            of dealing with subtle bugs in my code resulting from fetching data
            in <code>componentDidMount()</code>. Moreover, why should a
            component be responsible for fetching data in addition to rendering
            it? It feels like a violation of the{' '}
            <a href={siteConfig.srpUrl}>Single Responsibility Principle</a>.
            Looking for a better way, I came across this article by Michel
            Weststrate&mdash;
            <a href={siteConfig.mwArticleUrl}>How to decouple state and UI</a>.
            Here's an excerpt from the article which clearly describes the root
            cause of my problems:
        </p>

        <blockquote>
            <p>
                I discovered that most React applications are not driven by the
                state that is stored in stores; they are also driven by the
                logic in mounting components.
            </p>
            <ul>
                <li>
                    Interpreting route changes is often done in components;
                    especially when using react-router. The router constructs a
                    component tree based on the current URL, which fires of
                    componentWillMount handlers that will interpret parameters
                    and update the state accordingly.
                </li>
                <li>
                    Data fetching is often triggered by the fact that a
                    component is about to be rendered, and kicked off by the
                    componentWillMount lifecycle hook.
                </li>
            </ul>
        </blockquote>

        <p>
            Michel then shows how to decouple state and UI, resulting in a
            robust architecture where components don't have to fetch data. They
            are purely a function of the application state stored in stores.
            Stores become more like a state machine, making it easy to follow
            the transitions of our application. mobx-state-router provides a
            first-class implementation of this idea.
        </p>

        <p>
            My hope is that mobx-state-router will allow developers around the
            world to create more robust React applications with less headaches.
            If you like my work,{' '}
            <a href={siteConfig.githubUrl}>please star the repo</a> and refer it
            to your friends. Suggestions and PRs are welcome!
        </p>
    </React.Fragment>
);

const Concepts = ({ siteConfig, language }) => (
    <React.Fragment>
        <h2>Concepts</h2>
        <p>
            Before integrating mobx-state-router into your application, it's
            important to understand how it works. The section introduces you to
            the key concepts.
        </p>
        <p>
            At the heart of it, mobx-state-router provides a{' '}
            <code>RouterStore</code> that stores the <code>RouterState</code>.
        </p>
        <Image
            src={getImgUrl(siteConfig, 'architecture-diagram-1.png')}
            alt="Router Architecture"
        />
        <p>
            <code>RouterState</code> consists of 3 properties:
        </p>
        <ol>
            <li>
                <code>routeName</code>: A string that defines the state of the
                router. For example, <code>"department"</code> in the e-commerce{' '}
                <a href={siteConfig.liveDemoUrl}>Live Demo</a>, Mobx Shop.
            </li>
            <li>
                <code>params</code>: A set of key-value pairs that enhances the
                state. For example, <code>&#123;id: "electronics"&#125;</code>{' '}
                may signify that we are in the "department" state, but
                specifically in the "electronics" department.
            </li>
            <li>
                <code>queryParams</code>: A second set of key-value pairs to
                further enhance the state. For example,{' '}
                <code>&#123;q: "apple"&#125;</code> may signify that we want to
                query for the string "apple".
            </li>
        </ol>
        <p>
            As you may have guessed, this structure facilitates the
            decomposition of a URL into separate parts. However, from the
            router's viewpoint, this is simply application state that can be
            manipulated without any concerns about who is manipulating it
            (whether it's UI components or some other logic).
        </p>
        <p>
            Now that we understand <code>RouterState</code>, let's move to the
            top-left of the diagram. The <code>HistoryAdapter</code>, which is
            responsible for translating the URL in the browser address bar to
            the router state and vice-versa. It is essentially an "observer" of
            the address bar and the router state.
        </p>
        <p>
            Moving to the top-right, the <code>RouterView</code> watches the
            router state and instantiates the associated UI component. Finally,
            the UI components themselves can change the router state in reaction
            to user actions, such as keyboard entries and mouse clicks.
        </p>
        <p>
            Now let's understand these concepts better by walking through two
            common scenarios. The first is when the user enters a URL in the
            browser address bar:
        </p>
        <Image
            src={getImgUrl(siteConfig, 'architecture-diagram-2.png')}
            alt="URL Entry Scenario"
        />
        <ol>
            <li>
                User enters a URL in the browser address bar, e.g.
                http://mobx-shop.com/departments/electronics.
            </li>
            <li>
                <code>HistoryAdapter</code> notices the change and decomposes
                the URL into various parts.
            </li>
            <li>
                <code>HistoryAdapter</code> stores the decomposed URL into the{' '}
                <code>RouterState</code>.
            </li>
            <li>
                <code>RouterView</code> observes the change in{' '}
                <code>RouterState</code>.
            </li>
            <li>
                <code>RouterView</code> looks up the view associated with the
                new router state and instantiates it.
            </li>
        </ol>
        <p>
            The second scenario describes what happens when the user interacts
            with a view:
        </p>
        <Image
            src={getImgUrl(siteConfig, 'architecture-diagram-3.png')}
            alt="User Interaction Scenario"
        />
        <ol>
            <li>
                User clicks on an item on the Department page to see its
                details.
            </li>
            <li>
                The department page changes the <code>RouterState</code> to the{' '}
                <code>item</code> route with the <code>id</code> parameter set
                to item <code>E01</code>.
            </li>
            <li>
                <code>RouterView</code> observes the change in{' '}
                <code>RouterState</code>.
            </li>
            <li>
                <code>RouterView</code> looks up the view associated with the{' '}
                <code>item</code> state and instantiates the Item page.
            </li>
            <li>
                In parallel, the <code>HistoryAdapter</code> notices the change
                in <code>RouterState</code> and composes a URL from that state.
            </li>
            <li>
                <code>HistoryAdapter</code> sets the composed URL in the browser
                address bar.
            </li>
        </ol>
        <p>
            Hopefully, these scenarios gave you a good understanding of how
            mobx-state-router works. It's time to{' '}
            <a href={getDocUrl(siteConfig, language, GETTING_STARTED)}>
                get started
            </a>{' '}
            with a real app!
        </p>
    </React.Fragment>
);

class Index extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <section className="home-content">
                    <Features siteConfig={siteConfig} language={language} />
                    <Motivation siteConfig={siteConfig} language={language} />
                    <Concepts siteConfig={siteConfig} language={language} />
                </section>
            </div>
        );
    }
}

module.exports = Index;
