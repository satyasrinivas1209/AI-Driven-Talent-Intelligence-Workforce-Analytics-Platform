const crypto = require('crypto');

// Use JWT_SECRET to derive a 32-byte key
const getSecretKey = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return crypto.createHash('sha256').update(String(process.env.JWT_SECRET)).digest('base64').substring(0, 32);
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(getSecretKey()), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
};

const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(getSecretKey()), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
