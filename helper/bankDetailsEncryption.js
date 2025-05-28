import crypto from 'crypto';

// Key derivation configuration
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'SELECTSKILLSETENCRYPTIONSECRET';
const SALT = process.env.ENCRYPTION_SALT || 'SELECTSKILLSETSALT';
const KEY_LENGTH = 32; 
const IV_LENGTH = 16; 
const ITERATIONS = 100000;
const DIGEST = 'sha512';

// Derive a consistent key from the secret
const getEncryptionKey = () => {
  return crypto.pbkdf2Sync(
    ENCRYPTION_SECRET,
    SALT,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );
};

export const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      getEncryptionKey(),
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = (encryptedText) => {
  try {
    const [ivPart, encryptedPart] = encryptedText.split(':');
    if (!ivPart || !encryptedPart) return encryptedText; // fallback
    
    const iv = Buffer.from(ivPart, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      getEncryptionKey(),
      iv
    );
    let decrypted = decipher.update(encryptedPart, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};