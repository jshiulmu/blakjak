import { db, auth } from '../services/firebaseConfig'
import {
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    deleteDoc,
    doc,
    setDoc,
    exists,
    get
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

async function checkUser(user){
    const userRef = doc(db, "users", user.user.uid);
    userRef.get()
    .then((docSnapshot) => {
        if (docSnapshot.exists) {
            return true
        }
        else{
            return false
        }
    });
}

export async function createUser(user) {
    //used to be createArticle
    console.log(user)
    if (!checkUser(user)){
        let wins = 0
        let losses = 0
        
        console.log('sucess')
        console.log("display name: ", user)
        let ref = doc(db, "users", user.user.uid);
        
        const docRef = await setDoc(ref, {
            userName: user.user.displayName,
            wins: wins,
            totalGames: losses
        })
    } else if(checkUser(user)) {
        console.log(user.user.displayName, "  is already a user in the database")
    }

    //adds the data object to the "players" collection of the database (db)
    //docRef is the id of the data in the database collection
}
export async function fetchUsers() {
    //FETCHES LIST OF USERS
    const snapshot = await getDocs(
        query(collection(db, 'players'), orderBy('wins', 'desc'), limit(20))
    )
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}

export async function deleteArticle(id) {
    await deleteDoc(doc(db, 'articles', id))
}
