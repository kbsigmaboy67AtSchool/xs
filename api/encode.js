export default async function handler(req,res){

const {cover,password,data,name} = JSON.parse(req.body)

const payload = JSON.stringify({
name,
data,
password
})

const binary = [...payload]
.map(c=>c.charCodeAt(0).toString(2).padStart(8,"0"))
.join("")

const zw = {
0:"\u200B",
1:"\u200C"
}

let hidden=""

for(const b of binary)
hidden += zw[b]

const result = cover + hidden

res.status(200).send(result)

}
