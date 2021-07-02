invisiblelink.co/
invisiblelink.co/subscribe
invisiblelink.co/configure/:hash				-> /configure/?
invisiblelink.co/feed/:hash						-> /api/v1/feed/:hash

## User Feeds (what they subscribe to)
GET		invisiblelink.co/api/v1/feeds/:hash	(returns XML / JSON)

### Example
- invisiblelink.co/feed/4fc6ea8b

## User Feed Preferences
POST	invisiblelink.co/api/v1/subscriptions			-> /.netlify/functions/subscriptions.js
GET		invisiblelink.co/api/v1/subscriptions/:hash
PUT		invisiblelink.co/api/v1/subscriptions/:hash

## Feed Posts
POST	invisiblelink.co/api/v1/posts			-> /.netlify/functions/posts.js
GET		invisiblelink.co/api/v1/posts/:id
PUT		invisiblelink.co/api/v1/posts/:id

## Tags
GET		invisiblelink.co/api/v1/tags			-> /static/tags.json


