import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

// init arcjet 
export const ajt=arcjet({
  key:process.env.ARCJET_KEY,
  characteristics:["ip"],
  rules:[
    // shield protects your app from common attacts
    shield({mode:"LIVE"}),
    detectBot({
      mode:"LIVE",
      // block all bots except for search engines
      allow:[
        "CATEGORY:SEARCH_ENGINE"
        // See the full list at https://arcjet.com/bot-list
      ]
    }),


    // rate limiting

    tokenBucket({
      mode:"LIVE",
      refillRate:5,
      interval:10,
      capacity:10,
    })
  ]
})