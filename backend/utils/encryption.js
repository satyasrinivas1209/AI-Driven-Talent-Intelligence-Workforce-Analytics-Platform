const crypto = require('crypto');

// Use ENCRYPTION_KEY to derive a 32-byte key
const getSecretKey = () => {
  if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is required');
  // Use a raw 32-byte hash buffer
  return crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest();
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = getSecretKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag
  };
};

const decrypt = (encryptedData, iv, authTag) => {
  const key = getSecretKey();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
