"use strict"

require('dotenv').config();


const zang = require('zang-node');
const enums = zang.enums;

const connector = new zang.SmsConnector({
    accountSid: process.env.ZSID,
    authToken: process.env.ZAUTHTOKEN
});

const sms = {
    //default statusCallback is 'http://mycallback.url.com'
    // will incur $.005 per message sent 
    sendSms: function (endNum, message, statusCallback) {
        
        connector.sendSmsMessage({
            to: endNum,
            from: process.env.ZNUM,
            body: message,
            statusCallback: statusCallback,
            statusCallbackMethod: enums.HttpMethod.GET,
            allowMultiple: true
        }).then((data) => {
            
                console.log(data);
                return data;
            
        });
        
    },
    
    viewSms: function(smsSid) {
        connector.viewSmsMessage({ 
            smsMessageSid: smsSid 
        }).then((error, data) => { 
            if (error) {
                throw error;
            }
            else {
                console.log(data);
                return data;
            }
        });
    }

};


module.exports = sms;


