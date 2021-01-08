import { consoleMessage } from "./service/console";
import WebSocket from 'ws';
import crypto from "crypto-js";

const wsAddress = process.env.FOXBIT_API;

const ws = new WebSocket(wsAddress);

let messageFrame = {
    "m": 0,          //MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
    "i": 0,          //Sequence Number
    "n": "",         //Endpoint
    "o": ""          //Payload
};

const auth = () => {
    ws.on('open', function open() {

        consoleMessage('------------------------------------------------------------------------','startup');
        consoleMessage('Got connection','open.event');
    
        authenticateUser(messageFrame);
    
        consoleMessage('End connection','open.event');
    
    });
    
    ws.on('message', function incoming(data) {    
        test(messageFrame);
    });

    ws.on('close', function() {
        consoleMessage('WebService','close! ');
    });    
};

const test = frame => {
    console.log("FOI");
    const payload = {
        "UserId": parseInt(process.env.USER_ID)
    };

    frame.n = "GetAvailablePermissionList";
    frame.o = JSON.stringify(payload);

    ws.send(JSON.stringify(frame), function ack(error) {
        if (error != undefined){
            consoleMessage('Error', JSON.stringify(error));
        }
    });

    ws.on('message', function incoming(data) {  
        console.log(data);
    });

    ws.on('close', function() {
        consoleMessage('WebService','close! ');
    }); 
};

const authenticateUser = frame => {
    const apiKey= process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    const userId = process.env.USER_ID;
    const nonce = Date.now();
    const signature = crypto.HmacSHA256(nonce + userId + apiKey, apiSecret).toString(crypto.enc.Hex);

    const payload = {
        "APIKey": apiKey,
        "Signature": signature,
        "UserId": userId,
        "Nonce": nonce
    };

    frame.n = "AuthenticateUser";
    frame.o = JSON.stringify(payload);

    consoleMessage(frame.n, JSON.stringify(frame));

    ws.send(JSON.stringify(frame), function ack(error) {

        if (error != undefined) {
            consoleMessage('Error', JSON.stringify(error));
        }

    });
};

export default auth;