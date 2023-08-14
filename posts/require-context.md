---
id: require-context
title: Load files dynamically with Webpack
description: Learn how to use Webpack's require.context to dynamically load markdown files for a static blog
date: 23-11-2022
author: Pete Eamsuwan
readTime: 5 min
meta: Learn how to use Webpack's require.context function to dynamically load markdown files and make it easier to add new content to your site. With this technique, you can simply drop in new markdown files and rebuild your site without having to manually update any configuration files.
tags:
  - Typescript
  - Webpack
thumbnailPath: /post-img/webpack-thumbnail.webp
---

While working on this blog, I faced a challenge. One way to add new content to the blog was to manually import each markdown file containing the blog content into a configuration file, which would then be used to render the content in the react components.

However, this would require manual importing for every new blog I wanted to add, which is not ideal. Instead, I wanted a solution where I could simply drop in the markdown, rebuild, deploy, and be done.

This led me to consider using Webpack's require context feature.

## What is a Context?

---

In Webpack, a context is a reference to a directory in the file system. When you create a context using require.context, you specify the directory that the context should be based on, as well as some other optional parameters.

## Webpack's require.context

---

Webpack's `require.context` function allows you to create a context in which you can use the require function to dynamically require a list of modules. This can be useful in cases where you want to require a group of modules in a directory and don't want to manually specify each module.

The `require.context` function takes three arguments:

- The directory to search for modules
- A flag indicating whether to search subdirectories
- A regular expression to match against filenames

For example, in my case I would be looking at something like this:

```text
- assets/
  - posts/
    - blog_post_1.md
    - blog_post_2.md
    - blog_post_3.md

```

So, instead of manually importing each components like this:

```typescript
import BlogPost1 from './assets/posts/blog_post_1.md';
import BlogPost2 from './assets/posts/blog_post_2.md';
import BlogPost3 from './assets/posts/blog_post_3.md';
```

You can use `require.context(...)` to load all modules in the components directory like this:

```ts
const markdownContext = require.context('../assets/posts', false, /\.md$/); // line 1
const getModules = (context: __WebpackModuleApi.RequireContext) => context.keys().map(context); // line 2
const markdownModules = getModules(markdownContext); // line 3
```

_Wait!_ so how does line 2 work?

`context.keys()` returns an array of strings, where each string is the relative path to a module in the context. The map function iterates over this array and uses the context function to load each module.

So, if the `context.keys()` array contained the following strings:

```ts
['./assets/posts/blog_post_1.md', './assets/posts/blog_post_2.md', './assets/posts/blog_post_3.md'];
```

Then the `context.keys().map(context)` expression would be equivalent to:

```ts
const BlogPost1 = require('./assets/posts/blog_post_1.md');
const BlogPost2 = require('./assets/posts/blog_post_2.md');
const BlogPost3 = require('./assets/posts/blog_post_3.md');
```

The results from the `getModules` function will be dependent on which Webpack loader you use to load the markdown files, in my case, I am using:

```js
...
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader',
  options: {
    mode: [Mode.BODY],
  },
},
...
```

Which conveniently returns the frontmatter containing all the meta-data for each blog post and the actual content body itself.

If you are interested to see this working in action, please checkout the source code at [my github repo](https://github.com/eamsdev/MiniBlog).

## Resources

- [Webpack's Require.Context Documentation](https://webpack.js.org/guides/dependency-management/#requirecontext)
