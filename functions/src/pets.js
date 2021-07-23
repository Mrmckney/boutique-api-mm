const admin = require('firebase-admin')
const fbcreds = require('../credentials.json')

function connectDb(){
    if(!admin.apps.length) {
         admin.initializeApp({
            credential: admin.credential.cert(fbcreds)
        })
    }
    return admin.firestore() 
}

exports.getPets = (req, res) => {
    const db = connectDb()
    db.collection('pets').get()
    .then(customerCollection => {
        const petArray = customerCollection.docs.map(doc => {
            let pet = doc.data()
            pet.id = doc.id
            return pet
        })
        res.send(petArray)
    })
    .catch(err => res.status(500).send(err))
}

exports.createPet = (req, res) => {
    if(!req.body){
        res.status(401).send('Invalid request')
        return
    }
    const db = connectDb()
    db.collection('pets').add(req.body)
    .then(docRef => res.status(201).send({message:"Pet Created"}))
    .catch(err => res.status(500).send(err))

}