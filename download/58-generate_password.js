function generate_password(length = 16) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let password = ''
    for (let i = 0; i < length; i++) {
        password += chars[ Number.parseInt(chars.length * Math.random()) ]
    }
    return password
}

function onGenerate() {
    let obj = document.getElementById('psw')
    obj.innerHTML = generate_password()
}

onGenerate()