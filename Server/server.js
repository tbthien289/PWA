const express = require('express')
const webpush = require('web-push')
const cors = require('cors')
const bodyParser = require('body-parser')
global.atob = require("atob");

const vapidKeys = webpush.generateVAPIDKeys();
const PUBLIC_VAPID = vapidKeys.publicKey;
const PRIVATE_VAPID = vapidKeys.privateKey;

const app = express()

app.use(cors())
app.use(bodyParser.json())

webpush.setVapidDetails('mailto:you@domain.com', PUBLIC_VAPID, PRIVATE_VAPID)

// Get data
app.get('/vapidPublicKey', (req, res) => {
    const base64UrlToUint8Array = (base64UrlData) => {
        const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
        const base64 = (base64UrlData + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    
        const rawData = atob(base64);
        const buffer = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
            buffer[i] = rawData.charCodeAt(i);
        }
    
        return buffer;
    }

    res.send(PUBLIC_VAPID);
})

app.post('/sendNotification', (req, res) => {
    const subscription = req.body.subscription;

    const payload = "Modify Success!!!!!!";

    webpush.sendNotification(subscription, payload)
        .then(function () {
            res.sendStatus(201);
        })
        .catch(function (error) {
            console.log(error);
            res.sendStatus(500);
        });
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})


// app.post('/subscription', (req, res) => {
//     const subscription = req.body
//     fakeDatabase.push(subscription)
//   })

//   app.post('/sendNotification', (req, res) => {
//     const notificationPayload = {
//       notification: {
//         title: 'New Notification',
//         body: 'This is the body of the notification',
//       },
//     }

//     const promises = []
//     fakeDatabase.forEach(subscription => {
//       promises.push(
//         webpush.sendNotification(
//           subscription,
//           JSON.stringify(notificationPayload)
//         )
//       )
//     })
//     Promise.all(promises).then(() => res.sendStatus(200))
//   })
