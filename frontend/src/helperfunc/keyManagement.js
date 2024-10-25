import * as openpgp from 'openpgp';

const  generateKeyPair= async(name, email)=> {
    try{
  const {  privateKey, publicKey  } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: name, email }],
  });
  localStorage.setItem('privateKey', privateKey);  // Store private key securely
  return publicKey;  // Public key to be sent to the server
}catch(e){
    console.log(e)
}}

const encryptPrivateKey = async (privateKeyArmored, passphrase) => {
    const { data: encryptedPrivateKey } = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: privateKeyArmored }), // Your private key in armored format
      passwords: [passphrase], // Passphrase to encrypt the private key
      armor: true // Output as an ASCII armored string
    });
  
    return encryptedPrivateKey; // This will be stored in the cloud
  };

  const decryptPrivateKey = async (encryptedPrivateKey, passphrase) => {
    const { data: decryptedPrivateKey } = await openpgp.decrypt({
      message: await openpgp.readMessage({
        armoredMessage: encryptedPrivateKey 
      }), // The encrypted private key from cloud storage
      passwords: [passphrase], // The passphrase to decrypt the private key
      format: 'utf8' // Return as a string
    });
  
    return decryptedPrivateKey; // Decrypted private key in PGP armored format
  };

  export {generateKeyPair,encryptPrivateKey,decryptPrivateKey};