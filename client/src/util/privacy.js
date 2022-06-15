import 'gun/sea';

// ENCRYPTION
export async function encryption(email, getUser) {
  const encryptionKey = "myk-key"   // <-- This key is just an example. Ideally I think we should generate it every time sender sends an email.
  const encryptedMessage = await SEA.encrypt(email.body, encryptionKey)

  const recipientEpub = await getRecipientEpub(email)
  const myPair = getUser()._.sea    // "getUser()" is the current user

  const encryptedEncryptionKey = await SEA.encrypt(encryptionKey, await SEA.secret(recipientEpub, myPair))

  if (email.cc != null) {
    const CCRecipientsArray = await getCCRecipients(email, encryptionKey, myPair)
    email.keys = CCRecipientsArray
  }

  email.key = encryptedEncryptionKey
  email.body = encryptedMessage
  return email
}

async function getRecipientEpub(email) {
  getGun().get(`~@${email.recipient}`).once(user => {
    return user.epub
  })
  
  // await users.map().once(user => {    // "users" is the node where every user data is stored.
  //   if (user.email === email.recipient) {
  //     return user.epub
  //   }
  // })
}

async function getCCRecipients(email, encryptionKey, myPair) {
  let CCRecipientsArray = []
  let i = 0
  await users.map().once(user => {
    if (user.email === email.cc[i]) {
      const recipient = {
        email: user.email,
        key: await SEA.encrypt(encryptionKey, await SEA.secret(user.epub, myPair))
      }
      CCRecipientsArray.push(recipient)
    }
    i++
  })

  return CCRecipientsArray
}

// DECRYPTION
export async function decryption(email, getUser) {
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
    return await decrypt(email.key, email)
  } else if (isCarbonCopy) {
    const key = email.keys[position].key    // get the need key from email.keys array
    return await decrypt(key, email)
  } else {
    return
  }
}

async function decrypt(key, email) {
  const senderEpub = await getSenderEpub(email)
  const myPair = getUser()._.sea    // "getUser()" is the current user
  const decryptedEncryptionKey = await SEA.decrypt(key, await SEA.secret(senderEpub, myPair))
  const decryptedMessage = await SEA.decrypt(email.body, decryptedEncryptionKey)
  email.body = decryptedMessage
  return email
}

async function getSenderEpub(email, getGun) {
  getGun().get(`~@${email.sender}`).once(user => {
    return user.epub
  })

  // await users.map().once(user => {    // "users" is the node where every user data is stored.
  //   if (user.email === email.sender) {
  //     return user.epub
  //   }
  // })
}

async function getCurrentUserEmail(getUser) {
  await getUser().get("alias").once(user => {
    return user.email
  })
}

// let email = {
//   subject: "",
//   sender: "",
//   recipient: "",
//   body: "",
//   key: "",
//   cc: [],
//   bcc: [],
//   keys: []
// }