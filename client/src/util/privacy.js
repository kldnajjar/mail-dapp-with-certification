import 'gun/sea';
import regeneratorRuntime from 'regenerator-runtime';
const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

// ENCRYPTION
export async function encryption(email, getGun, getUser) {
  const encryptionKey = "myk-key"   // <-- This key is just an example. Ideally I think we should generate it every time sender sends an email.
  const encryptedMessage = await SEA.encrypt(email.body, encryptionKey)

  const recipientEpub = await getRecipientEpub(email, getGun)
  const myPair = getUser()._.sea    // "getUser()" is the current user

  const encryptedEncryptionKey = await SEA.encrypt(encryptionKey, await SEA.secret(recipientEpub, myPair))

  if (email.cc != null) {
    const CCRecipientsArray = await getCCRecipients(email, encryptionKey, myPair, getGun)
    email.keys = CCRecipientsArray
  }

  email.key = encryptedEncryptionKey
  email.body = encryptedMessage
  return email
}

async function getRecipientEpub(email, getGun) {
  let recipientEpub
  await getGun().get(`~@${email.recipient}`).map().once(user => {
    recipientEpub = user.epub
  })
  return recipientEpub
}

async function getCCRecipients(email, encryptionKey, myPair, getGun) {
  let CCRecipientsArray = []
  let i = 0

  await getGun().get(`~${APP_PUBLIC_KEY}`).get("profiles").map().once(async user => {
    if (user.email === email.cc[i]) {
      const recipient = {
        email: user.email,
        key: await SEA.encrypt(encryptionKey, await SEA.secret(user.epub, myPair))
      }
      CCRecipientsArray.push(recipient)
    }
    i++
  })

  // await users.map().once(async user => {
  //   if (user.email === email.cc[i]) {
  //     const recipient = {
  //       email: user.email,
  //       key: await SEA.encrypt(encryptionKey, await SEA.secret(user.epub, myPair))
  //     }
  //     CCRecipientsArray.push(recipient)
  //   }
  //   i++
  // })

  return CCRecipientsArray
}

// DECRYPTION
export async function decryption(email, getGun, getUser) {
  const currentUserEmail = await getCurrentUserEmail(getUser)
  let isCarbonCopy = false
  let position = 0

  email.cc.forEach((element, index) => {
    if (currentUserEmail === element.recipient) {
      isCarbonCopy = true
      position = index
    }
  })

  if (currentUserEmail === email.recipient) {
    return await decrypt(email.key, email, getGun)
  } else if (isCarbonCopy) {
    const key = email.keys[position].key    // get the need key from email.keys array
    return await decrypt(key, email, getGun)
  } else {
    return
  }
}

async function decrypt(key, email, getGun) {
  const senderEpub = await getSenderEpub(email, getGun)
  const myPair = getUser()._.sea    // "getUser()" is the current user
  const decryptedEncryptionKey = await SEA.decrypt(key, await SEA.secret(senderEpub, myPair))
  const decryptedMessage = await SEA.decrypt(email.body, decryptedEncryptionKey)
  email.body = decryptedMessage
  return email
}

async function getSenderEpub(email, getGun) {
  let senderEpub
  await getGun().get(`~@${email.sender}`).map().once(user => {
    senderEpub =  user.epub
  })
  return senderEpub
}

async function getCurrentUserEmail(getUser) {
  let currentAlias
  await getUser().get("alias").once(user => {
    currentAlias = user.email
  })
  return currentAlias
}

let email = {
  subject: "",
  sender: "",
  recipient: "",
  body: "",
  key: "",
  cc: {},
  bcc: {},
  keys: {}
}