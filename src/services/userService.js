import { db } from '../services/firebaseConfig'
import {
    collection,
    query,
    getDocs,
    addDoc,
    orderBy,
    limit,
    deleteDoc,
    doc,
} from 'firebase/firestore'

export async function createUser() {
    //used to be createArticle
    let wins = 0
    let losses = 0
    const data = { wins, losses } //creates the data object (the users wins and losses)

    //adds the data object to the "players" collection of the database (db)
    //docRef is the id of the data in the database collection
    const docRef = await addDoc(collection(db, 'players'), data)
    return { id: docRef.id, ...data }
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
