import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secure-key';

export const encryptFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binary = e.target?.result as string;
        const encrypted = CryptoJS.AES.encrypt(binary, SECRET_KEY).toString();
        resolve(encrypted);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
};

export const decryptFile = (encryptedData: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
};