export const config = {
api:{ bodyParser:{ sizeLimit:"50mb"} }
}

export default function handler(req,res){

const {cover,password,data,name} = req.body

const payload = JSON.stringify({
name,
data,
password
})

let bits=""

for(const c of payload){
bits += c.charCodeAt(0).toString(2).padStart(8,"0")
}

let hidden=""

for(const b of bits){
hidden += b==="0" ? "\u200B" : "\u200C"
}

res.status(200).send(cover + hidden)

}
