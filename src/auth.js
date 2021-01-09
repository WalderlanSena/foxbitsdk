import { consoleMessage } from "./service/console";
import WebSocket from 'ws';
import crypto from "crypto-js";

const wsAddress = process.env.FOXBIT_API;

const ws = new WebSocket(wsAddress);

let messageFrame = {
    "m": 0,
    "i": 0,
    "n": "",
    "o": ""
};

const auth = () => {
    ws.on('open', function open() {
        consoleMessage('------------------------------------------------------------------------','startup');
        consoleMessage('Got connection','open.event');
    
        authenticateUser(messageFrame);
    
        consoleMessage('End connection','open.event');
    });
    
    ws.on('message', function incoming(data) {
        consoleMessage('Message => ', data);
        GetAccountTrades(messageFrame);
    });

    ws.on('close', function() {
        consoleMessage('WebService','close! ');
    });    
};

const GetL2Snapshot = (frame) => {
    const payload = {
        "OMSId": 1,
        "InstrumentId": 1,
        "Depth": 100
    };

    frame.n = "GetProduct";
    frame.o = JSON.stringify(payload);

    ws.send(JSON.stringify(frame), function ack(error) {
        if (error != undefined){
            consoleMessage('Error', JSON.stringify(error));
        }
    });
};

const GetAccountTrades = (frame) => {
    const payload = {
        "AccountId": parseInt(process.env.USER_ID),
        "OMSId": 1,
        "StartIndex":0,
        "Count":2
    };

    frame.n = "GetAccountTrades";
    frame.o = JSON.stringify(payload);

    ws.send(JSON.stringify(frame), function ack(error) {
        if (error != undefined){
            consoleMessage('Error', JSON.stringify(error));
        }
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

    const messageFrame = JSON.stringify(frame);

    ws.send(messageFrame, function ack(error) {

        if (error != undefined) {
            consoleMessage('Error', JSON.stringify(error));
        }

    });
};

export default auth;