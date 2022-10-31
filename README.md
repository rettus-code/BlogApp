# BlogApp
Database:
    Stayed with mongoDB due to ease of implimentation and focus on getting the app running

https://temp1-483271681.us-west-2.elb.amazonaws.com/post/about

Issues:
    Was unable to migrate to a AWS RDB so didn't use related dependencies. Also had problems with pm2, could not get the command working on an instance so added another instance where I was able to properly set the path. In the original instace whereis pm2 returned an empty path. Website defaults to https despite removing .key and .cert files, importing http, and changing the app.listen, it accepts http in the url but when selecting a different page it tries the https protocol. We're using ` to seperate the title and comment string in the cach so any posts using the ` char will cause a problem. This can be fixed just need the time to make the changes. 
