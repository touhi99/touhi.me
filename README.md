# touhi.me

Personal site of Touhidul Alam: an interactive career map at `/` and a plain, printable CV at `/cv`. Built with Next.js, TypeScript and Tailwind CSS. The CV page is based on [BartoszJarocki/cv](https://github.com/BartoszJarocki/cv) (MIT).

The content for both pages is in one file, [`src/data/resume-data.tsx`](./src/data/resume-data.tsx).

## Run

Requires Node.js 18.18 or later and yarn.

```bash
yarn install
yarn dev
```

Production build: `yarn build && yarn start`. With Docker: `docker compose up -d --build`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
