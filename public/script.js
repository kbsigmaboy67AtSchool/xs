const fileInput = document.getElementById("file")
const output = document.getElementById("output")

async function readFile(file){

return new Promise(res=>{
const reader = new FileReader()

reader.onload = () => res(reader.result)

reader.readAsArrayBuffer(file)
})
}

document.getElementById("encode").onclick = async ()=>{

const file = fileInput.files[0]

const buffer = await readFile(file)

const base64 = btoa(
String.fromCharCode(...new Uint8Array(buffer))
)

const res = await fetch("/api/encode",{
method:"POST",
body:JSON.stringify({
cover:cover.value,
password:password.value,
data:base64,
name:file.name
})
})

const text = await res.text()

if(text.length < 500000)
output.value = text
else
output.value = "[Output too large]"

}
