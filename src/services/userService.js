import { db, auth } from '../services/firebaseConfig'
import {
    collection,
    query,
    getDocs,
    addDoc,
    orderBy,
    limit,
    deleteDoc,
    doc,
    setDoc
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

export async function createUser(user) {
    //used to be createArticle
    let wins = 0
    let losses = 0
    
    console.log('sucess')
    console.log("display name: ", user)
    let ref = doc(db, "users", user.user.displayName);

    const docRef = await setDoc(ref, {
        wins: wins,
        totalGames: losses
    })

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
