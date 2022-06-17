# Carbon IT Treasure Map

This is a coding exercise for Carbon IT.

The application is deployed at
[https://carbon-treasure-map.vercel.app/](https://carbon-treasure-map.vercel.app/)
using Vercel each time a commit is pushed to master.

## Understanding the code

This is a simple one-page React app, without any router.
The state is managed via React hooks because there is very little of it,
so including something like Redux or MobX isn't worth the trouble.

The root component can be found in [TreasureMap.tsx](./src/components/TreasureMap.tsx),
while the main simulation logic is located in [Game.ts](./src/lib/Game.ts).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
