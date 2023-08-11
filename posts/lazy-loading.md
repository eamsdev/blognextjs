---
id: lazy-loading
title: Lazy Loading React Components
description: Use React.lazy() and import() to dynamically load content on demand instead of up-front.
date: 31-01-2023
author: Pete Eamsuwan
readTime: 3 min
meta: Learn how to use React.lazy and Webpacks dynamic import to dynamically load content on demand instead of up-front.
tags:
  - React
  - Typescript
  - Webpack
---

In one of the previous articles we investigated code-splitting and how it, with the help of browser caching, could help reduce traffic on subsequent visits. This technique helps reduce the time for subsequent load by only fetching the javascript files that have changed, but what about the initial load? In this article we will discuss lazy loading, and demonstrate how it can help reduce initial load time of your website.

## Lazy loading in React

In React, Lazy loading is a technique where a component is loaded and rendered only when it is needed, thus improving the performance and reducing the initial load time of a web page. By using `React.lazy` function, components can be loaded asynchronously when it is called the first time, rather than loading all components at once.

`React.lazy` is used in conjunction with the dynamic `import()` syntax. When Webpack comes across this syntax, it automatically starts code-splitting your app.

Let's see how it is done in action:

```tsx
const AboutMe = React.lazy(() => import('./AboutMe'));
const ArticlesSearch = React.lazy(() => import('./ArticlesSearch'));

...

export const Content: FC = observer(() => {
  return (
...
        <Route
          path="/articles"
          element={
            <Suspense fallback={<Spinner />}>
              <ArticlesSearch />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<Spinner />}>
              <AboutMe />
            </Suspense>
          }
        />
...
  );
});
```

In the above code snippet, the `AboutMe` component is being lazily imported as a React component via `const AboutMe = React.lazy(() => import('./AboutMe'));`

The lazily imported component then can be used just like any normal component. You will also need to wrap the component in the `<Suspense>` wrapper so that any fall back component can be shown while the lazily imported component is being loaded. In this case, we are just showing a spinner component.

## Seeing it in action

With the above code snippet, we would expect to see the JS bundle correspond to the AboutMe component getting loaded on demand when the user navigates to the AboutMe component.

![Network Log](/post-img/lazy-load-0.webp)

Cool! that is exactly what we expected. Navigating back and forth will not re-load this bundle, as it has been previously loaded

## Using Webpack's dynamic import

What are some use cases of using the dynamic `import()` statement alone without the `React.lazy` part? This is something that is somewhat relevant to this blog. At the time of writing, this blog is driven by plain old React SPA, no Server Side Rendering/Static Site Generation. This means that as the number of articles grow, the number of "blog posts" that need to be loaded upfront also grow.

### Dynamically load blog posts

One way to solve this issue is to dynamically load the blog posts on demand, when you need it e.g. when a user navigates to a specific page, or a specific blog post.

To achieve this, I created a manifest file containing the meta data of each post, and defined a function to dynamically import the actual markdown content.

```ts
const manifests: Manifest[] = [
  {
    id: 'require-context',
    title: 'Load files dynamically with Webpack',
    ...
    content: () => import('../assets/posts/0_20221223_Require_Context.md'),
  },
```

As you can see, `content` is just simply a function that we can invoke to return a `Promise` for the markdown content body. The meta data is there so I have access to titles and tags on first load.

Let's see how this is used:

```tsx
const IndividualBlogView = ({ blogPost, onFinishLoading, styles }: IndividualBlogViewProps) => {
  const [body, setBody] = React.useState('');
  useEffect(() => {
    blogPost
      .content()
      .then((x) => {
        setBody(x.body);
        onFinishLoading();
      })
      .catch((e) => console.error(e));
  }, [blogPost]);

  return (
    <div style={styles} className="container p-0 m-0">
      <Helmet>
        <title>{blogPost.attributes.title}</title>
        <meta name="description" content={blogPost.attributes.meta} />
      </Helmet>
      <BlogPost key={blogPost.attributes.title as string} frontMatter={blogPost.attributes}>
        <StylisedMarkdown markdown={body} />
      </BlogPost>
    </div>
  );
};
```

As you can see in the snippet, we invoke the content() function to get the `Promise` for the markdown body, then set the `body` when the `Promise` is resolved. Here I have also invoked a callback `onFinishLoading()` to remove the spinning wheel and show the content once the component has rendered (for UX purposes, specifically to reduce Cumulative Layout Shift (CLS)).

### Seeing it work in action

With the code above, I expect that each JS bundle will be loaded only when I first navigate to the page that requires it. And to no surprise, this is the case. Screenshot below is the network's tab result of me navigating through my previous 3 articles.

![Network Log #2](/post-img/lazy-load-1.webp)

If you are interested to see this working in action, please check out the source code at [my github repo](https://github.com/eamsdev/MiniBlog).

## Resources

- [Code Splitting](https://reactjs.org/docs/code-splitting.html)
