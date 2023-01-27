# pips_channel_personal-website_webapp

<!-- TOC -->

- [pips_channel_personal-website_webapp](#pips_channel_personal-website_webapp)
  - [what is this ?](#what-is-this-)
  - [resources and endpoints](#resources-and-endpoints)
    - [API](#api)
    - [web app'](#web-app)
  - [pre requisites](#pre-requisites)
  - [how to run](#how-to-run)
  - [good to know](#good-to-know)
  - [CI/CD](#cicd)
  - [contribution guidelines](#contribution-guidelines)
  - [contributors](#contributors)

<!-- /TOC -->

## what is this ?

the client-side code that powers my personal website API, feel free to use this as a template for your own blog

## resources and endpoints

### API

- `/api/builds` : PubSub webhook to trigger a build on Vercel
- `/api/statuses` : returns the current status of the app'

### web app'

- `/` : the home page
- `/posts/:slug` : the given post by slug or 404

## pre requisites

- [Node.js](https://nodejs.org/en/) >= 10.13
- [Typescript](https://www.typescriptlang.org/)

## how to run

- clone the repo
- run `npm install` to install the dependencies
- run `npm run dev` to start the server on port 3000

## good to know

- conditional styling can be enabled using [`clsx` package](https://github.com/lukeed/clsx)
- fonts are loaded via [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Roboto font
- images are automatically optimized for size, responsiveness, and lazy loading

## CI/CD

app' is deployed on Vercel, creating a PR should allow for previewing; watch out for the root directory of the app' and the preset configuration of the Vercel app' when you set up the project

thanks to the Vercel API, you can also trigger builds programmatically

as matter of fact, the `/api/builds` endpoint is a webhook that triggers a build on Vercel when receiving a Google PubSub message; for this to work

## contribution guidelines

dear past, present, and future contributors, you have my many thanks, but please follow these guidelines:

- please use comments to explain your code, even if it's obvious to you, it might not be to someone else
- you are free to arrange the code, the folder structure, the file names, etc. as you see fit if you're able to provide a good reason for it

that's all, thank you for your time !

## contributors

a big thanks goes to the contributors of this project:

<table>
<tbody>
    <tr>
        <td align="center"><a href="https://github.com/yactouat"><img src="https://avatars.githubusercontent.com/u/37403808?v=4" width="100px;" alt="yactouat"/><br /><sub><b>Yactouat</b></sub></a><br /><a href="https://github.com/yactouat"></td>
    </tr>
</tbody>
</table>
