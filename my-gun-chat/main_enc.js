const gun = Gun("http://localhost:3000/gun")
const user = gun.user().recall({ sessionStorage: true })
const chat = gun.get("chat")
const users = gun.get("users")
const friend_node = chat.get("friend_node").put({
  conversationId: String.random(3),
  encKey: "key",
})
const messages = friend_node.get("messages")

$("#up").on("click", () => {
  user.create($("#username").val(), $("#password").val(), () => {
      users.get($("#username").val())
      login()
  })
})

// onLogin
$("#in").on("click", login)

// Login function
function login() {
  user.auth($("#username").val(), $("#password").val())
  return false
}

// onAuth
gun.on("auth", async (ack) => {
  $(".chat").show()
  $(".sign").hide()

  // get username from user node and assign it to nameText element
  let username
  await user.get("alias").once(data => {
      $(".nameText").text(data)
      username = data
  })

  // Adding this user to users graph
  await users.get(username).put({
      name: username,
      pub: ack.sea.pub,
      epub: ack.sea.epub,
      id: ack.id
  })
})

$(".submit_button").on("click", async (e) => {  // onClick
  submit(e)
})

$(".chat_input_form").on("submit", async (e) => {   // onPressEnter/return key
  enter(e)
})

// check enter/return key
async function enter(e) {
  if (e.which !== 13) {
      return
  }
  await submit(e)
}

// onGetUserName or pub
$("#getpub").on("click", (e) => {
  e.preventDefault()
  user.once(data => {
      console.log(`Current user pub: ${data.epub}`)
  })
})

// get all users' usernames
$("#getallusers").on("click", (e) => {
  e.preventDefault()
  console.log("clicked get all users")
  users.map().once(data => {
      console.log(data.name)
  })
})

$("#set_to_friend_node").on("click", (e) => {
  e.preventDefault()

  user.once(data => {
    friend_node.get(data.pub).put({
      name: data.alias,
      pub: data.pub,
      epub: data.epub
    })
  })
})

// onLogout
$("#leave").on("click", (e) => {
  user.leave()
})

// onSend
async function submit(e) {
  e.preventDefault()

  // Storing the message, who sent it and timestamps
  let msg = {
      time: Gun.state(),
      conversationId: null,
      message: null
  }

  await friend_node.once(data => {
    msg.conversationId = data.conversationId
  })

  await user.once(data => {
      msg.from = data.alias
  })

  if (!msg.from) {
      msg.from = "user" + String.random(3)
  }

  msg.message = $(".message_input").val()

  if (!msg.message) {
      return
  }

  // Finding receiver's epub by name
  let receiverEncryptedPublicKey
  let username
  await user.get("alias").once(alias => {
    username = alias
  })

  // Encrypting messages
  const myPair = await SEA.pair()
  
  let encryptionKey
  await friend_node.map().once((data, key) => {
    if (key === "encKey") {
      encryptionKey = data
    }
  })

  await friend_node.map().once(data => {
    
  })

  const encryptedMessage = await SEA.encrypt(msg.message, encryptionKey)
  const secret = await SEA.secret(user2.epub, user1)
  const encryptedData = await SEA.encrypt(encryptionKey, secret)

  // Storing in the database
  messages.set(msg)

  $(".message_input").val("").focus()
}

// Rendering data (messages) to UI from chat node
messages.map().once((data, key) => {
  UI(data, key)
})

// Data (messages) to UI
async function UI(msg, id) {
  await user.get("pub").once(myPub => {
    friend_node.map().once(data => {
      if (typeof data.name === "string" && data.pub === myPub) {
        render(msg.from, msg.message, id)
      }
    })
  })
}

function render(from, msg, id) {
  let list = $("<li>")
  $(list).attr("id", id).appendTo("ul")
  $(list).text(`${from}: ${msg}`)
}

async function decryptFunction(msg, epub, pair) {
  const secret = await SEA.secret(epub, pair)
  const decryptedData = await SEA.decrypt(msg, secret)    // Using secret to decrypt
  return decryptedData
}