export const config = {
api:{ bodyParser:{ sizeLimit:"50mb"} }
}

export default function handler(req,res){

const {text,password} = req.body

let bits=""

for(const c of text){

if(c === "\u200B") bits+="0"
if(c === "\u200C") bits+="1"

}

let chars=""

for(let i=0;i<bits.length;i+=8){

chars += String.fromCharCode(
parseInt(bits.slice(i,i+8),2)
)

}

const payload = JSON.parse(chars)

if(payload.password !== password){
res.status(403).send("Wrong password")
return
}

res.json(payload)

}
