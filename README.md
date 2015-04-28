###############################################
### Currency Fair - Market Trade Processor  ###
###############################################


The project uses nodeJS, redis and web-sockets. All the logs are saved to a redis list and every 8 seconds chunks of 10 logs are processed and send to the front-end through web-sockets.


############################
### Populating with logs ###
############################

For populating with log messages please use this link:
http://php-adriant.rhcloud.com/?calls=100

You can use ?calls= to set up to 10000 calls. 

The post data has the below structure:

[
    {
        "securityToken": "currencyfair",
        "log": {
            "userId": "134256",
            "currencyFrom": "EUR",
            "currencyTo": "GBP",
            "amountSell": 1000,
            "amountBuy": 747.1,
            "rate": 0.7471,
            "timePlaced": "24-JAN-15 10:27:44",
            "originatingCountry": "FR"
        }
    }
]


In order to send the messages to the system, a securityToken is nedeed. The security token is: currencyfair


############################
###      APP Config      ###
############################

The config settings are stored in libs/config/config.js


############################
###     POST endpoint    ###
############################

http://localhost/

############################
###       Frontent       ###
############################

http://localhost/
