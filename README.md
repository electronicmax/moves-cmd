moves liberator
=========

This simple command-line tool makes it easy to get a copy of your complete location history OUT of [Moves App](http://moves-app.com) and to store it safely in json.  Executes mostly from command line, with one browser OAuth handshake at the beginning to get an access token. 

Requirements
------
1. nodejs (including npm)
2. moves app

Set up and usage
------

1. Clone this respository
2. Install node.js on your platform
3. Run ``npm install``
4. [Create a new app on dev.moves-app.com](https://dev.moves-app.com/apps)
5. Set the redirect URL of your app to be ``http://localhost:8000/moves`` 
6. Locate the Client ID and Client Secret in the Development tab of your app, and copy these into a local text file
7. Run: ``./get_token.js --cid [your clientid] --csecret [your csecret] > tokens.json``


This will output a URL. Open a browser to that URL and follow the instructions. When this terminates, proceed.

8. Run:

    ./get_data.js --tokens [path_to_tokens_json] > data.json

9. Enjoy!! =)

TODO
------
1. RDF Output
2. Refresh token renewal
3. Better error handling and documentation

Licensing
------
(c) - Max Van Kleek <max@hip.cat> for friends at the [W3C](http://w3c.org).

MIT License. Party as you like! But Don't blame me if stuff happens.