const {FIDO2Client} = require('fido2client');
const readlineSync = require('readline-sync');
const crypto = require('crypto');

let fido2 = new FIDO2Client(false);
let options = {
    publicKey: {
        challenge: crypto.randomBytes(32),
        rp: {
            name: "VinCSS"
        },
        user: {
            id: crypto.randomBytes(32),
            name: "test@example.com",
            displayName: "Test"
        },
        pubKeyCredParams: [
            {type: "public-key", alg: -7},
            {type: "public-key", alg: -257}
        ],
        authenticatorSelection: {
            userVerification: "required",
            requireResidentKey: true
        }
    }
};

console.log('[[makeCredential]]');
console.log(options);

fido2.makeCredential(options, 'https://localhost').then((credential) => {
    console.log(credential);
    console.log('[[getAssertion]]');

    let options = {
        publicKey: {
            challenge: crypto.randomBytes(32),
            // allowCredentials:[{'type': 'public-key', 'id': base64url.toBuffer(credential.id)}],
            userVerification: 'required'
        }
    };

    fido2.getAssertion(options, 'https://localhost').then((assertion) => {
        console.log(assertion);
    })

});

fido2.on('fido2-enter-pin', () => {
    let pin = readlineSync.question('Enter your security key\'s PIN: ', {hideEchoBack: true});
    fido2.reply(pin);
});

fido2.on('fido2-resident-key', (residents) => {
    console.log(residents);
    fido2.reply(0);
});