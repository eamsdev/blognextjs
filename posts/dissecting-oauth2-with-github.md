---
id: oauth2-github
title: Dissecting OAuth2, with Github
description: Learn more about OAuth2 and how to use it to access protected resources on github.
date: 03-04-2023
author: Pete Eamsuwan
readTime: 14 min
meta: Learn more about OAuth2 and how to use it to access protected resources on github.
tags:
  - OAuth
  - Security
---

So you have created a shiny new application with a basic Email/Password authentication/authorization, and you want to add a "Sign In with Github" button to it (or something similar with Google/Microsoft etc). How would you go about doing it?

To achieve this, it's best that we understand the OAuth2 specification and how it works. In this article, we will be dissecting OAuth2 Authorization Code flow, with Github. I will be referencing the OAuth2 source material from time to time, by _Internet Engineering Task Force_ (IETF, sounds cooler when it's not abbreviated doesn't it?), namely the [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)

### But why not use OAuth 2.1?

Because OAuth 2.1 is still a work in progress. Once it is officially released, I'll be covering the Proof Key for Code Exchange that would be required for all clients using the Authorization Code Flow.

## OAuth 2 Protocol Refresher

![Abstract Protocol Flow](/post-img/github-oauth-0.webp)

The [diagram](https://www.rfc-editor.org/rfc/rfc6749#section-1.2) above describe the high level interaction between four roles involved in the OAuth Protocol, note the following:

1. The "Client" is the entity that is requesting the authorization to access the protected resource. **Nowhere** in the OAuth specification does it say that the Client **must** be a javascript code running in the browser or the web server, it could be either, both, or something else entirely.
2. Note that OAuth specification makes a very **clear distinction** on _Resource Owner_, _Authorization Server_, and the _Resource Server_. Note that these are logical abstractions, not necessary a physical one.
3. Note that the OAuth specification makes a very **clear distinction** on the _Authorization Grant vs Access Token_.
4. **Nowhere** in the spec did they mention _JSON Web Tokens (JWT)_, that's implementation detail.

## Implicit Flow

Implicit flow is a simplified authorization flow optimized for clients and implemented in a browser (read: no backend). Instead of issuing the client Authorization Code, the client is issued the Access Token directly. The access token is returned directly to the client as a result of the redirect and is exposed to the client side code which could be potentially intercepted. Because of said security vulnerability, we won't be digging deeper into the implicit flow.

## Authorization Code Flow

Authorization Code Flow (or "Web Server Flow") is more secure and the recommended approach for OAuth 2.0 authentication, in fact, it follows exactly what the Abstract Protocol Flow described without any simplification.

With this flow, the user is directed to the authorization server. Should their authentication be successful, they will be redirected back with the authorization code. The authorization code is then sent back to the backend and the backend uses it to request the access token. With the access token, access to the protected resource is possible.

As you can probably see, the access token exchange is done server to server and thus (with proper TLS encryption) can't be intercepted.

### B...B..But what if the authorization code is intercepted?

The attacker won't be able to do much because:

1. The authorization code is generally short lived, OAuth specification recommends the MAXIMUM of 10 minutes lifespan.
2. The authorization code can only be used once, based on the specification, code re-use MUST result in access token denial (from the Authorization Server), and if possible SHOULD revoke all access tokens issued by that authorization code.
3. The attacker won't have access to the `client_secret` that is stored server side, said secret is used during the access key exchange.

## Putting the theory to work, with Github

So by now you probably have a rough idea of how OAuth2 flow works, so let's tinker around with Github OAuth endpoint to see how we can use it to get user data.

### Setting up Github OAuth Apps

First step, we need to setup a new OAuth App with Github, navigate to the following [link](https://github.com/settings/developers) -> OAuth Apps -> New OAuth App. Fill out the following details:

![Register new OAuth Application](/post-img/github-oauth-1.webp)

Take note that the Authorization callback URL is the URL that the user will be redirected to after they have completed the Authorization Request <-> Authorization Grant flow.

Submit the form then generate a new client secret:

![Client secret](/post-img/github-oauth-2.webp)

### Authorization Request/Grant

Right now we have all the information that is required to make the Authorization Request, so let's do it.

Based on section [4.1.1. Authorization Request](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1) of the OAuth specification some of the following parameters are required.

1. `response_type`: `code`, because we are using the Authorization Code Flow. _(interestingly, based on Github documentation, this is not required)_
2. `client_id`: The client identifier that we have retrieved from Github after creating a new OAuth App
3. _Optional_ `scope`: the access scope, leaving this blank means you will only have access to public information in the case of Github.
4. _Few other optional parameters_, consult Github [docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) if you would like to know more.

From this [link](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) it seems that Github OAuth address is at `https://github.com/login/oauth/authorize`.

So our Authorization Request should look like the following (at the minimum): `https://github.com/login/oauth/authorize?client_id=09733dda645552cda1f2`,let's fire up the browser and navigate there:

![Github Login](/post-img/github-oauth-3.webp)

Awesome! we got the Github login screen, and it's showing the name of the application, "Test" that I registered earlier. Let's enter the credentials and login.

![Github Authorize](/post-img/github-oauth-4.webp)

Exactly what we expected, because we did not provide the scope, the application is only authorized to use public data, let's authorize it.

![Redirect](/post-img/github-oauth-5.webp)

Interesting, after authorizing the Test application, I get redirected to `localhost:8080?code=aa845fe2209052d2f6bb`, but why? Well it is because:

1. We have registered the redirect URL as `localhost:8080` when we set up the application, and as I mentioned earlier, this is the URL that you will be redirected to after you have authorized the application.
2. The `code` query parameter is actually our Authorization code! We can use this along with `client_id` and `client_secret` to get our `access_token`

### Retrieving the Access Token

Without further adieu, let's try get the `access_token`. Based on section [4.1.3. Access Token Request](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3) (I know that you can just consult Github's documentation, but I think it is interesting to find out how Github implementations of OAuth2 line up with the actual specification), some of the following parameters should be included:

1. `code`: authorization code received from the previous step
2. `client_id`: the same `client_id` we used earlier, provided by Github
3. `client_secret`: this is required based on the description in [3.2.1. Client Authentication](https://www.rfc-editor.org/rfc/rfc6749#section-3.2.1) and section [2.3.1. Client Password](https://www.rfc-editor.org/rfc/rfc6749#section-2.3.1), we got this secret from Github.
4. `grant_type`: query parameter must be set to `authorization_code` (interestingly, based on Github documentation, **this is not required**, it's not mentioned at all even)
5. Few other optional params, specifically for Github [(docs)](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps).

In addition to the above, Github has mentioned in their documentation that the request has to be a [POST to](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github) `https://github.com/login/oauth/access_token`

So let's spin up Postman and set up our POST request, and post it:

![Access Token](/post-img/github-oauth-6.webp)

Hooray! We got the access token!

### Using the Access token to retrieve the Protected Resource

Let's try to use it to hit the API:

```shell
C:\Users\po-ea>curl -H "Authorization: Bearer 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" https://api.github.com/user
{
  "login": "eamsdev",
  "id": 76290232,
  "node_id": "MDQ6VXNlcjc2MjkwMjMy",
  "avatar_url": "https://avatars.githubusercontent.com/u/76290232?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/eamsdev",
  "html_url": "https://github.com/eamsdev",
  "followers_url": "https://api.github.com/users/eamsdev/followers",
  "following_url": "https://api.github.com/users/eamsdev/following{/other_user}",
  "gists_url": "https://api.github.com/users/eamsdev/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/eamsdev/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/eamsdev/subscriptions",
  "organizations_url": "https://api.github.com/users/eamsdev/orgs",
  "repos_url": "https://api.github.com/users/eamsdev/repos",
  "events_url": "https://api.github.com/users/eamsdev/events{/privacy}",
  "received_events_url": "https://api.github.com/users/eamsdev/received_events",
  "type": "User",
  "site_admin": false,
  "name": "eamsdev",
  "company": null,
  "blog": "https://eams.dev",
  "location": "Melbourne",
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 12,
  "public_gists": 0,
  "followers": 0,
  "following": 1,
  "created_at": "2020-12-20T09:16:20Z",
  "updated_at": "2023-03-30T04:53:21Z"
}
```

Which returns the "protected" resource from the resource server, not that these are all public information, because I left the request scope empty in the Authorization Request. To access private resources, you will need to provide the scope parameter. For example, in the case of user's email, for Github you will need to provide `...&scope=user:email` in the query param. The scope parameter values will depend on the providers, you will need to consult their documentation ([Github's Scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps))

For example, when repeating the above flow with addition `user:email` scope, Github will prompt me that the client application is requesting additional permissions:

![Additional Permisssions](/post-img/github-oauth-7.webp)

And with that you will get an Authorization Code that you can use to retrieve an Access Token to retrieve the user's email (different endpoint, as described by the [docs](https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user)):

```shell
C:\Users\po-ea>curl -H "Authorization: Bearer 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" https://api.github.com/user/emails
[
  {
    "email": "XXXXXXXXX@gmail.com",
    "primary": true,
    "verified": true,
    "visibility": "private"
  },
  {
    "email": "XXXXXXXXX+eamsdev@users.noreply.github.com",
    "primary": false,
    "verified": true,
    "visibility": null
  }
]
```

Hope you find this article informative! In the next article (or next next) we will be looking at adding the actual Github authentication to a React/.Net application.

## Resources

1. [OAuth2 Specification](https://www.rfc-editor.org/rfc/rfc6749)
2. [Github's OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
