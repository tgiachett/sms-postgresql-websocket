const models  = require("../models");
const express = require("express");
const router  = express.Router();
const sms = require('../controller/sms.js');
const socketEventEmitter = require('../controller/socketEmitters')



router.post("/incoming", (req, res) => {
  res.send("Success");
  
  let smsComObj = {};
  let msgInfo = req.body;
  socketEventEmitter.emit('routeTrigger', req.body);
  // trigger the websocket, testing inside route (prob should be middleware)
  // merge request body onto smsComObj
  smsComObj.from = msgInfo.From;
  smsComObj.SmsSid = msgInfo.SmsSid;
  smsComObj.wholeBody = msgInfo.Body;
  // smsComObj.date = moment()
  
  const smsArr = msgInfo.Body.split(", ");
  
  switch(smsArr[0].toLowerCase()) {
    case "post":
      //Table tree
      //if there's a tbl name
      
        
        //make an object for the Table into that tbl
        smsComObj.tbl = smsArr[2];
        smsComObj.smsBody = smsArr[1];
        //if there's a password set for that table, store it
        // if(smsArr[3].toLowerCase()) {
        //   smsComObj.tblPass = smsArr[3];
        // }
        
        
        models.Table.create(
          smsComObj
        ).then(() => {
          //get the id of the Table just entered
          models.Table.findOne(
            {
            where: {
              SmsSid: smsComObj.SmsSid
            }
            
          }).then(result => {
            
            sms.sendSms(smsComObj.from, `Table logged @ID = ${result.id}`);

            
          })
          // send out the response text
          // sms.sendSms(smsComObj.from, `Table Successfully logged with id ${thisId}`);
        });
        
      // } else { 
      //   console.log("switch works tbl false")
      //     // validate: if there is no table name given, send error
      //     let noTblErr = "ERR: No tbl arg after message";
      //     sms.sendSms(smsComObj.from, noTblErr);
      
      break;
    case "get":
      switch(smsArr[1].toLowerCase()) {
        case "date": 
          //date querying logic NOT QUITE SURE HOW TO DO THIS YET
          // smsComObj.dateSearch = smsArr[2];
          // models.Table.findAll({
          //   where: {

          //   }
          // })
          break;
        case "id":
          //id search logic
          
          smsComObj.idSrch = smsArr[2];
          
          let idSrchRes = {};
          // the number of the search result is smsArr[3]
          if(!smsArr[2]) {
            sms.sendSms(smsComObj.from, `ERR: no ID specified`)
          }
          
          models.Table.findById(smsComObj.idSrch).then((result) => {
            // let shortDate = result[tblSrchRes.resI].createdAt.split(" ")
            // shortDate = shortDate.slice(0,4)
            
            sms.sendSms(smsComObj.from, `${result.createdAt}: "${result.smsBody}" @ID:${result.id} `)
          });
          
          break;  
      }
      break;
    case "put":
      //put logic put id text
      models.Table.update({
        smsBody: smsArr[2],
      }, {
        where: {
          id: smsArr[1],
        }
      });
      sms.sendSms(smsComObj.from, `Table upd @ID= ${smsArr[1]} `)
      break;
    case "delete":
      //delete logic
      models.Table.destroy({
        where: {
          id: smsArr[1]
        }
      })
      sms.sendSms(smsComObj.from, `Table deleted @ID= ${smsArr[1]}`)
      break;
    case "help":
      //return help options to user
      const helpString = "COMMANDS: POST, TEXT, [TAG]; GET, ID, IDNUM;PUT, IDNUM, TEXT; DELETE, IDNUM; HELP ";
      sms.sendSms(smsComObj.from, helpString);
      
      break;
    case "auth":
      //auth logic
      break;
    
    
    
  }
});

module.exports = router;

