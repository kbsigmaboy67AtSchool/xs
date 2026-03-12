const fileInput = document.getElementById("file")
const textInput = document.getElementById("textInput")
const cover = document.getElementById("cover")
const password = document.getElementById("password")
const output = document.getElementById("output")
const loading = document.getElementById("loading")

function showLoading(v){
loading.style.display = v ? "block" : "none"
}

async function readFile(file){

return new Promise((resolve,reject)=>{

if(!file){
resolve(null)
return
}

const reader = new FileReader()

reader.onload = ()=> resolve(reader.result)
reader.onerror = reject

reader.readAsArrayBuffer(file)

})

}

function arrayBufferToBase64(buffer){

let binary=""
const bytes = new Uint8Array(buffer)

for(let i=0;i<bytes.length;i++){
binary += String.fromCharCode(bytes[i])
}

return btoa(binary)

}

document.getElementById("encode").onclick = async ()=>{

showLoading(true)

try{

let payload=null
let name="text.txt"

if(textInput.value.trim() !== ""){

payload = btoa(textInput.value)

}else{

const file = fileInput.files[0]

if(!file){
alert("Provide text or file")
showLoading(false)
return
}

const buffer = await readFile(file)
payload = arrayBufferToBase64(buffer)
name = file.name

}

const res = await fetch("/api/encode",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
cover:cover.value,
password:password.value,
data:payload,
name:name
})

})

const result = await res.text()

output.value = result.length < 500000
? result
: "[Output too large to display]"

}catch(e){

console.error(e)
alert("Encoding failed")

}

showLoading(false)

}

document.getElementById("decode").onclick = async ()=>{

showLoading(true)

try{

const res = await fetch("/api/decode",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
text:output.value,
password:password.value
})

})

const data = await res.json()

const link = document.getElementById("download")

link.href = "data:application/octet-stream;base64," + data.data
link.download = data.name
link.textContent = "Download file"

}catch(e){

alert("Decode failed")

}

showLoading(false)

}
