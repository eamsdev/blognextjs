---
id: nextjs-cloudfront-s3
title: About Nextjs, Cloudfront and S3 (and caching)
description: Configuring Nextjs static sites to work with S3 and Cloudfront can be tricky. Additionally, we need to talk about caching...
date: 25-08-2023
author: Pete Eamsuwan
readTime: 5 min
meta: Configuring Nextjs static sites to work with S3 and Cloudfront can be tricky, see how here. Additionally, we need to talk about caching.
tags:
  - AWS
  - CICD
thumbnailPath: /post-img/nextjs-cloudfront-s3-thumbnail.webp
---

I have recently re-written this blog and converted it from a vanilla React SPA to a statically generated site built on Next.js framework. Upon deployment to my S3 and CloudFront hosting environment, to my surprise, I received 404s responses on several pages, excluding the home page (index.html). Keep in mind that this environment works flawlessly with my previous React SPA.

Here are what I have discovered, and what I have done to fixed it.

## HTMLs vs Nice URLs

Let's take a moment to think about what happens when we make a request to a hosting server for the root path "/". Web servers generally have a default action to look for an `index.html` file at the specified directory, **if** the specified path is a directory, "/" being one of them. This explains why the home page was the only page that was functioning and not 404ing out, because by requesting the root path, in my case, `https://eams.dev/`, CloudFront is actually serving `https://eams.dev/index.html`.

What about when I make a request for URL that isn't a directory (For example, this page that you are reading, `https://eams.dev/nextjs-cloudfront-s3`)? In this case, CloudFront actually looks for a specific resource named `nextjs-cloudfront-s3` at the root `/` directory, this is where the setup for Single Page Application and Static Site Generation differs.

With SPA, the Web Server is generally configured to return the same index.html in case it cannot locate the resource, the client-side routing in JavaScript then takes over and routes the user to the correct pages. In the case of SSG, HTML pages are actually generated at build time for each "route", and thus CloudFront needs to be setup such that it knows to fetch `/foobar.html` when `/foobar` is requested.

How can we do this? Lambda@Edge to the rescue.

## Lambda@Edge

Lambda@Edge is a feature of CloudFront that allows you to run Lambda (Serverless) functions at edge locations in response to CloudFront events, whether it be Viewer Request/Response (client requesting content from the CDN, or the associated response) or Origin Request/Response (CDN requesting the content from Origin, or the associated response).

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

1. Remove a trailing slash, if exists, and
2. If the URL does not have a file extension, append `.html`

After deploying this change, all my pages works flawlessly.

### URL Rewrite is not the same as Redirect

One thing to note here is that in the above code example, I'm rewriting the request URL and _not redirecting_ the user to the one with `.html` suffix. The distinction is by rewriting the URL, I'm simply serving a different content than what was requested (in this case `/foobar.html` rather than the requested `/foobar`), and as far as the client and/or the browser is concerned, it requested `/foobar` and got `/foobar`. In summary, rewrite is server-side and is invisible to the client while redirect is client side and is visible to the client.

### Viewer Request or Origin Request?

By using Lamba@Edge to do URL rewrite, you have two options:

1. Rewrite the URL before the request hits the CDN, **or**
2. Rewrite the URL before the request hits the Origin, in the case of cache miss.

In my testing, with how Lambda@Edge are set-up with CloudFront, this doesn't really make much of a difference, albeit personally I have put it at the Origin Request path, as theoretically to should get called less often.

## We need to talk about caching

Caching, when properly configured can improve load times and reduce network traffic, all-in-all, it can help improve experience of the visitors to your website.

I have experimented with several caching configurations with CloudFront + S3 and have come up with what works for me, and what doesn't.

### Browser and CDN caching

Browser and CDN caching are two different caching techniques, but the concepts are the same. With browser caching, the cached data is stored on the user's local device, while with CDN caching, the data is stored on the edge locations (CDN servers).

#### What works for me

During the deployment of the static assets to S3 storage, I configure the `Cache-Control` headers, based on the file types

```yaml
post_build:
  commands:
    - aws s3 rm s3://eams.dev --recursive
    - aws s3 sync ./out s3://eams.dev --cache-control max-age=8640000 --exclude "*.html"
    - aws s3 sync ./out s3://eams.dev --cache-control "no-cache, no-store" --include "*.html"
```

What happens here is that I set the `Cache-Control` `max-age` value to be reasonably large value, for all non HTML files (roughly the value that will pass Lighthouse Audit). While the HTML files are served with `no-cache, no-store` value.

This combines with CloudFront caching behaviour's `MinimumTTL` being set to 0, will result in static assets such as `.js` and `.webp` assets being cached, and `.html` files not being cached (CloudFront will always fetch them from Origin), which is exactly what I need.

#### What I do not recommend

I have seen some suggestions online where people suggest creating additional CloudFront behaviours with different Path Patterns, i.e.: `*.html` with caching disabled, `*.*` with caching enabled, and `*` as default catch-all with caching enabled (in this exact precedent). While this will work, it creates additional configuration complexity on your CDN side while also limit your URL options to never include `.` character for path that you don't want to cache.

### Concluding Remarks

While all these setups can just be simplified away by using Vercel's hosting options, my cloud infrastructure is already set up with AWS along with my familiarity with the technology. Hence, why I insisted on deploying this SSG blog on AWS.

This was an interesting learning journey for me and I hope you find this post useful.

## References

- [Manage CloudFront Cache Expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
