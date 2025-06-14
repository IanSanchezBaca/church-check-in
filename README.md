## to do list
- [x] **create the database page for admins**

- [ ] **create the sign in page for parents**
    - [ ] **also make it show up in the database page that theyre present for the class (morning/afternoon)**

- [x] fix the css for register as it breaks when you press register from the checkIn/kids page

- [ ] make a checkbox to allow the password to be visible when typing password in login

- [ ] Somehow make it so that it prints out reports.
    - will need to ask maria what exactly she wants

- [ ] if user is admin have the database preloaded so that it saves on reads when they go into the database.
    - also probably preload what the user is instead of checking everytime


<br/><br/><br/><br/><br/><br/><br/><br/>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
# this is the best since i dont have to run build then start
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Working on a Different Machine

Running this command should allow you to work on the website after cloning to a different machine
```
npm install
```

Also need to install firebase to the new machine
```
npm install firebase
```