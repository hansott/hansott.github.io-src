+++
date = "2016-03-13T11:34:28+02:00"
title = "Add homestead MySQL as data source in PhpStorm"
tags = ["Laravel", "Vagrant", "Homestead", "MySql", "PhpStorm"]
+++

To be able to work with your databases in PhpStorm, you should define them as data sources. Data sources provide the basis for SQL coding assistance and code validation.

> Laravel Homestead is an official, pre-packaged Vagrant box that provides you a wonderful development environment without requiring you to install PHP, HHVM, a web server, and any other server software on your local machine.

Select `View | Tool Windows | Database`, click on the `+` button and choose `Data Source | MySQL`:

![Add MySQL data source](/images/phpstorm-add-data-source.png)

Use the following settings:

**Host**: `127.0.0.1`  
**Database**: `your-database-name` (default is `homestead`)  
**User**: `homestead`  
**Password**: `secret`  

![General Settings](/images/phpstorm-homestead-general-settings.png)

The last step is authentication:

**Proxy Host**: `192.168.10.10` (You can find this in `~/.homestead/Homestead.yaml`)  
**Proxy User**: `vagrant`  
**Auth Type**: `Key pair (OpenSSH)`  
**Private key file**: `/path/to/.ssh/id_rsa`  (In my case: `/Users/hansott/.ssh/id_rsa`)  

![SSH/SSL settings](/images/phpstorm-homestead-ssh-settings.png)

That's it!

### Links
* [PHPStorm: Databases and SQL](https://www.jetbrains.com/phpstorm/help/databases-and-sql.html)
* [PHPStorm: Managing Data Sources](https://www.jetbrains.com/phpstorm/help/managing-data-sources.html)
* [Laravel Homestead](https://laravel.com/docs/master/homestead)
