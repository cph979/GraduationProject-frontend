import cryptoJs from 'crypto-js'

const option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }

/**
 * 前端DES加密
 *
 * @param message
 * @param key
 * @returns {string}
 */
export const encryptDES = (message, key) => {
  message = JSON.stringify(message);
  let keyHex = cryptoJs.enc.Utf8.parse(key);
  let encrypted = cryptoJs.DES.encrypt(message, keyHex, option);
  return encrypted.toString();
}

/**
 * 前端DES解密
 *
 * @param message
 * @param key
 * @returns {string}
 */
export const decryptDES = (message, key) => {
  let keyHex = cryptoJs.enc.Utf8.parse(key);
  let decrypted = cryptoJs.DES.decrypt(message, keyHex, option);
  return decrypted.toString(cryptoJs.enc.Utf8);
}