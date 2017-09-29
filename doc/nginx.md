
# Nginx

#### By Bo Henderson
#### Created Sep 16, 2017
#### Updated Sep 19, 2017

## Resources
 - [Nginx's Official Beginners Guide](http://nginx.org/en/docs/beginners_guide.html)
 - [Nginx vs Apache](https://www.digitalocean.com/community/tutorials/apache-vs-nginx-practical-considerations)
 - [Nginx Architecture](http://www.aosabook.org/en/nginx.html)

## Misc

It's pronounced "engine-x", not "en-jinx"

One nginx master process reads configuration and manages several worker processes which process requests, etc.

Core configuration file located at `/etc/nginx/nginx.conf`.

Rules are called directives: these are simple `key value` pairs separated by a space and terminated by a semicolon.

Config file arranged in a hierarchical tree where child contexts inherit from and can overwrite their parents.

## Contexts
 - 'location': followed by a prefix (eg `/img`) and then a block of child directives. Longest matching prefix is used to selectively apply some set of rules.


## Simple Directives
 - `root`: Specifies the folder from which the web server should serve files. If `root` is set to `/var/www/html`, then content will be served out of this folder and any subfolders.
 - `proxy_pass`:
 - `proxy_ssl`:
 - `listen`:
 - `server_name`:

