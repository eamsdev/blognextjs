---
id: nextjs-cloudfront-s3
title: About Nextjs, Cloudfront and S3 (and caching)
description: Configuring Nextjs static sites to work with S3 and Cloudfront can be tricky, see how here. Additionally, we need to talk about caching...
date: 25-08-2023
author: Pete Eamsuwan
readTime: 5 min
meta: Configuring Nextjs static sites to work with S3 and Cloudfront can be tricky, see how here. Additionally, we need to talk about caching.
tags:
  - AWS
  - CICD
thumbnailPath: /post-img/nextjs-cloudfront-s3-thumbnail.webp
---

I have recently re-written this blog and converted it from a vanilla React SPA to a statically generated site built on Next.js framework. Upon deployment to my S3 and Cloudfront hosting environment, to my surprise, I received 404s responses on several pages, excluding the home page (index.html). Keep in mind that this environment works flawlessly with my previous React SPA.

Here are what I have discovered, and what I have done to fixed it.

## HTMLs vs Nice URLs

Let's take a moment to think about what happens when we make a request to a hosting server for the root path "/". Web servers generally have a default action to look for an `index.html` file at the specified directory, **if** the specified path is a directory, "/" being one of them. This explains why the home page was the only page that was functioning and not 404ing out, because by requesting the root path, in my case, `https://eams.dev/`, Cloudfront is actually serving `https://eams.dev/index.html`.

What about when I make a request for URL that isn't a directory (For example, this page that you are reading, `https://eams.dev/nextjs-cloudfront-s3`)? In this case, Cloudfront actually looks for a specific resource named `nextjs-cloudfront-s3` at the root `/` directory, this is where the setup for Single Page Application and Static Site Generation differs.

With SPA, the Web Server is generally configured to return the same index.html in case it cannot locate the resource, the client-side routing in JavaScript then takes over and routes the user to the correct pages. In the case of SSG, HTML pages are actually generated at build time for each "route", and thus Cloudfront needs to be setup such that it knows to fetch `/foobar.html` when `/foobar` is requested.

How can we do this? Lambda@Edge to the rescue.

## Lambda@Edge

Lambda@Edge is a feature of Cloudfront that allows you to run Lambda (Serverless) functions at edge locations in response to Cloudfront events, whether it be Viewer Request/Response (client requesting content from the CDN, or the associated response) or Origin Request/Response (CDN requesting the content from Origin, or the associated response).

Lambda@Edge has multiple use cases, and the one that will help us here is its ability to manipulate the incoming request URL. For example, for the incoming request for `/foobar` we can rewrite the URL so that it points to `/foobar.html` instead. Here is how you can do it.

```ts
// check if url has extension like .html
const hasExtension = /(.+)\.[a-zA-Z0-9]{2,5}$/;
// check if url end with '/'
const hasSlash = /\/$/;

export const handler = async (event) => {
  const { request } = event.Records[0].cf;
  let url = request.uri;

  if (url.match(hasSlash)) {
    // Trim trailing slash
    url = url.slice(0, -1);
  }

  if (url && !url.match(hasExtension)) {
    // If url has no extension add .html
    request.uri = `${url}.html`;
  }

  return request;
};
```

The code above does two simple things, it re-writes the URL to:

1. Remove trailing slashes
2. If the URL does not have a file extension, append `.html`

After deploy this change, all my pages works flawlessly.

### URL Rewrite is not the same as Redirect

One thing to note here is that in the above code example, I'm rewriting the request URL and _not redirecting_ the user to the one with `.html` suffix. The distinction is by rewriting the URL, I'm simply serving a different content than what was requested (in this case `/foobar.html` rather than the requested `/foobar`), and as far as the client and/or the browser is concerned, it requested `/foobar` and got `/foobar`. In summary, rewrite is server-side and is invisible to the client while redirect is client side and is visible to the client.

### Viewer Request or Origin Request?

By using Lamba@Edge to do URL rewrite, you have two options:

1. Rewrite the URL before the request hits the CDN, **or**
2. Rewrite the URL before the request hits the Origin, in the case of cache miss.

In my testing, with how Lambda@Edge are set-up with Cloudfront, this doesn't really make much of a difference, albeit personally I have put it at the Origin Request path, as theoretically to should get called less often.

## We Need To Talk About ~~Kevin~~ Caching

### Browser vs CDN caching

### Concluding Remarks

## References
