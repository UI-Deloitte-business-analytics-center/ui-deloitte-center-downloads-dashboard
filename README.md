# 📊 UI-Deloitte Center Downloads Summary Dashboard

This dashboard fetches download logs from the [University of Illinois-Deloitte Foundation Center for Business Analytics Website](https://centerforanalytics.giesbusiness.illinois.edu/) and displays a summary of who are using the materials.

For questions or issues, please email Ye Joo Park at [ypark32@illinois.edu](mailto:ypark32@illinois.edu).

## Development

### Running locally

#### Clone the repository

```bash
$ git clone https://github.com/UI-Deloitte-business-analytics-center/ui-deloitte-center-downloads-dashboard
```

#### Install npm packages

```bash
# go into the cloned folder
$ cd ui-deloitte-center-downloads-dashboard

# using npm
$ npm install
# or using yarn
$ yarn install
```

#### Run development server

Running `npm run dev` (or `yarn dev`) will run a development server.

```bash
$ npm run dev
# or
$ yarn dev

# output
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Go to `http://localhost:3000` in your browser.

#### Making changes

Making changes to the files will hot-reload the development server.

#### Stage and commit changes

```bash
$ git add -A
$ git commit -m "Commit message here"
$ git push
```

This will trigger a build in Vercel and will take 2~5 minutes to complete.


If the build is successful, a green checkmark is displayed.

![image](https://user-images.githubusercontent.com/1064036/172668279-8428e474-fc65-41cb-b036-48b2f664eccd.png)

If the build fails, a red checkmark is displayed.

![image](https://user-images.githubusercontent.com/1064036/172668292-22646848-2ad1-4eef-940d-292de2136b41.png)


## Notes
- If a member downloads a material more than once, only the first download is used to generate this summary.
- The download logs are pulled from Wix's `http-functions` backend. To customize what data you are pulling, edit the `http-functions.js` file through the Wix editor.
- The Center website's URL is hard-coded (https://centerforanalytics.giesbusiness.illinois.edu/) when fetching logs through a HTTP GET request. If the URL changes, update it accordingly in the `utils/retrieveSummary.ts` file (https://github.com/UI-Deloitte-business-analytics-center/ui-deloitte-center-downloads-dashboard/blob/main/utils/retrieveSummary.ts).

```typescript
export async function retrieveSummary(): Promise<IDownloadsSummary> {
  // change the URL inside fetch()
  const res = await fetch(
    `https://centerforanalytics.giesbusiness.illinois.edu/_functions/downloads_summary`
  );
  const data = await res.json();
  
  // ...
}
```

## Screenshots

<img src="https://user-images.githubusercontent.com/1064036/172012906-3469dee7-f5fe-43e9-811e-0f49c17e086f.png" alt="" width="600" />

<img src="https://user-images.githubusercontent.com/1064036/172012925-d28f28d8-b404-4439-a5b1-8cc6728123f8.png" alt="" width="600" />

<img src="https://user-images.githubusercontent.com/1064036/172012934-45843815-72e5-41d9-a5d6-33bd8aef345d.png" alt="" width="600" />

<img src="https://user-images.githubusercontent.com/1064036/172012947-b065b7ab-038d-4779-9a13-09695d5cb0f4.png" alt="" width="600" />

## Built with

This site is built with [Next.js](https://nextjs.org/) and is continuously deployed to [Vercel](https://www.vercel.com).
