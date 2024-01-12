require("dotenv").config();
const crypto = require("crypto");

// run "openssl rand -hex 32" in terminal to generate a key
// the env variable ENCRYPTION_KEY contains 32 random bytes as hex
// this is converted to a buffer to use as the secret key; https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding
// a buffer is a variable-length, fixed-type data structure that can store raw binary data. Buffers are used to store data that is being read from or written to a file, or that is being sent over a network.
// used to create a new buffer containing the specified string, array, or buffer. It takes two parameters:
// 1- data to be converted to a buffer. This can be a string, an array, or another buffer.
// 2- optional encoding. If this is specified, the data will be converted to the specified encoding before being converted to a buffer.
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// we are using the aes encryption algorithm
// The aes-256-cbc algorithm uses a 256-bit key, which is very difficult to crack.
const algo = "aes-256-cbc";

function encrypt(plainText) {
  // the Intialization Vector is random data/bytes which is mixed into the plainText before encryption
  // it ensures that encrypting the same plainText twice does not result in the same
  // encryptedText, which prevents attacks
  const iv = crypto.randomBytes(16);

  // cipher implements the aes algo with the key and IV
  const cipher = crypto.createCipheriv(algo, key, iv);

  // encrypt the text
  let encryptedText = cipher.update(plainText, "utf8", "hex");
  encryptedText += cipher.final("hex");

  // we prefix the encryption with the IV because we need to use the same IV to decrypt
  // it later on - it is ok for the IV to be public (but never the key)
  return iv.toString("hex") + ":" + encryptedText;
}

function decrypt(input) {
  // split it into the IV which we prefixed
  // and the text we want to decrypt
  const parts = input.split(":");

  // turn the IV into a buffer (it is currently hex)
  const iv = Buffer.from(parts[0], "hex");

  // this is the encrypted text we want to decrypt again
  const encryptedText = parts[1];

  // decipher the text and format as utf-8 so we can read it!
  // The crypto.createDecipheriv() method is used to create a Decipher object in the crypto module of Node.js. It takes the following arguments:
  // algorithm: The algorithm to use for decryption.
  // key: The key to use for decryption.
  // iv: The initialization vector to use for decryption.
  // options: An object of options to control the decryption process.
  // The Decipher object can then be used to decrypt data that was encrypted with the corresponding Cipher object.
  const decipher = crypto.createDecipheriv(algo, key, iv);
  let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
  decryptedText += decipher.final("utf8");

  return decryptedText;
}

module.exports = { encrypt, decrypt };
