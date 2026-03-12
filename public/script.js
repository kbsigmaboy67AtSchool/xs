const fileInput = document.getElementById("file")
const importFile = document.getElementById("importFile")
const textInput = document.getElementById("textInput")
const cover = document.getElementById("cover")
const password = document.getElementById("password")
const output = document.getElementById("output")
const loading = document.getElementById("loading")
const progressBar = document.getElementById("progressBar")

let lastEncodedOutput = ""

function showLoading(v){
loading.style.display = v ? "block" : "none"
}

function setProgress(v){
progressBar.style.width = v + "%"
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

async function arrayBufferToBase64(buffer){

const bytes = new Uint8Array(buffer)

let binary=""
const chunkSize = 50000

for(let i=0;i<bytes.length;i+=chunkSize){

const chunk = bytes.slice(i,i+chunkSize)

binary += String.fromCharCode(...chunk)

setProgress(Math.floor((i/bytes.length)*100))

await new Promise(r=>setTimeout(r,0))

}

setProgress(100)

return btoa(binary)

}

document.getElementById("encode").onclick = async ()=>{

showLoading(true)
setProgress(0)

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
payload = await arrayBufferToBase64(buffer)
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

lastEncodedOutput = result

if(result.length < 500000){
output.value = result
}else{
output.value = "[Output too large to display. Use Export Output.]"
}

}catch(e){

console.error(e)
alert("Encoding failed")

}

showLoading(false)
setProgress(0)

}

document.getElementById("decode").onclick = async ()=>{

showLoading(true)

try{

const res = await fetch("/api/decode",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
text:lastEncodedOutput || output.value,
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

document.getElementById("exportOutput").onclick = ()=>{

if(!lastEncodedOutput){
alert("No output to export")
return
}

const blob = new Blob([lastEncodedOutput],{
type:"text/plain"
})

const url = URL.createObjectURL(blob)

const a = document.createElement("a")

a.href = url
a.download = "encoded_output.txt"

document.body.appendChild(a)
a.click()
a.remove()

URL.revokeObjectURL(url)

}

document.getElementById("importOutput").onclick = ()=>{

importFile.click()

}

importFile.onchange = ()=>{

const file = importFile.files[0]

if(!file) return

const reader = new FileReader()

reader.onload = ()=>{

lastEncodedOutput = reader.result

if(reader.result.length < 500000)
output.value = reader.result
else
output.value = "[Large encoded file loaded. Ready to decode.]"

}

reader.readAsText(file)

}
