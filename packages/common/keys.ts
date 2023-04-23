export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(
  publicKey: CryptoKey,
  message: string
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    data
  );
  return new Uint8Array(encryptedData);
}

export async function decryptMessage(
  privateKey: CryptoKey,
  encryptedData: Uint8Array
): Promise<string> {
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}
