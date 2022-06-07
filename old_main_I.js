/*
  This is an old version, main.js is the new one.
*/

const gun = Gun("http://localhost:3000/gun")
const user = gun.user().recall({ sessionStorage: true })
const chat = gun.get("chat")
const users = gun.get("users")

// onSignUp
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

// onLogout
$("#leave").on("click", (e) => {
    user.leave()
})

// onSend
async function submit(e) {
    e.preventDefault()

    await users.map().once(data => {
        console.log(data.name)
        console.log(data.pub)
        console.log(data.epub)
        console.log(data.id)
    })

    // Storing the message, who sent it and timestamps
    let msg = {
        when: Gun.state()
    }

    await user.once(data => {
        msg.from = data.alias
    })

    if (!msg.from) {
        msg.from = "user" + String.random(3)
    }

    msg.what = $(".message_input").val()

    if (!msg.what) {
        return
    }

    msg.type = "all" 

    // private message
    if (msg.what.includes("/")) {
        const array = msg.what.split("/")
        let receiver = array[0]
        let message = {
            from: msg.from,
            to: receiver,
            type: "private",
            msg: array[1]
        }
  
        // Finding receiver's epub by name
        let receiverEncryptedPublicKey
        await users.map().once(data => {
            if (data.name === receiver) {
                receiverEncryptedPublicKey = data.epub
                return
            }
        })

        // The following code is from here: https://github.com/amark/gun/wiki/Snippets
        const myPair = user._.sea
        // Encryption
        const secret = await SEA.secret(receiverEncryptedPublicKey, myPair)
        const encryptedData = await SEA.encrypt(`${message.msg}`, secret)  // Using secret to encrypt
        message.msg = encryptedData
        console.log(message.from, message.to, message.msg)
        // Adding message to chat node
        chat.set(message)

        $(".message_input").val("").focus()

        return
    }

    // Adding to message to chat node
    chat.set(msg)

    $(".message_input").val("").focus()
}

// Rendering data (messages) to UI from chat node
chat.map().once(UI)

// Data (messages) to UI
async function UI(msg, id) {

    await users.map().once(data => {
        console.log(data.name)
        console.log(data.pub)
        console.log(data.epub)
        console.log(data.id)
    })

    console.log(msg)

    if (msg.type === "private") {
        // Finding sender's epub by name
        let senderEncryptedPublicKey
        await users.map().once(data => {
            if (data.name == msg.from) {
                senderEncryptedPublicKey = data.epub
                return
            }
        })

        // The following code is from here: https://github.com/amark/gun/wiki/Snippets
        const myPair = user._.sea
        // Decryption
        const decryptedData = await decryptFunction(msg.msg, senderEncryptedPublicKey, myPair)

        if (decryptedData !== undefined) {
            let list = $("<li>")
            $(list).attr("id", id).appendTo("ul")
            $(list).text(`${msg.from}: ${decryptedData}`)
        }
    } else {
        let list = $("<li>")
        $(list).attr("id", id).appendTo("ul")
        $(list).text(`${msg.from}: ${msg.what}`)
    }

}

async function decryptFunction(msg, epub, pair) {
    const secret = await SEA.secret(epub, pair)
    const decryptedData = await SEA.decrypt(msg, secret)    // Using secret to decrypt
    return decryptedData
}