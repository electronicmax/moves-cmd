moves-cmd
=========

This simple command line tool allows you to grab your data from moves-app
and store it safely in json.  Executes mostly from command line, with one
browser OAuth handshake at the beginning to get an access token.

Set up and usage
==

1. Clone this respository
2. Install node.js on your platform
3. Run ``npm install``
4. [Create a new app on dev.moves-app.com](https://dev.moves-app.com/)
5. Set the redirect URL of your app to be ``http://localhost:8000/moves`` 
6. Locate the Client ID and Client Secret in the Development tab of your app, and copy these into a local text file
7. Run:
  This will output a URL. Open a browser to that URL and follow the instructions. 
8. Run:

Options
--
