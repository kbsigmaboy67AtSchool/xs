export default async function handler(req,res){

const {text,password} = JSON.parse(req.body)

const zw = {
"\u200B":"0",
"\u200C":"1"
}

let bits=""

for(const c of text){
if(zw[c]) bits += zw[c]
}

let chars=[]

for(let i=0;i<bits.length;i+=8){
chars.push(
String.fromCharCode(
parseInt(bits.slice(i,i+8),2)
)
)
}

const payload = JSON.parse(chars.join(""))

if(payload.password !== password)
return res.status(403).send("Wrong password")

res.status(200).json(payload)

}
