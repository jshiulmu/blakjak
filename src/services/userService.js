import { db, auth } from '../services/firebaseConfig'
import {
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    deleteDoc,
    doc,
    setDoc
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

export async function updateUser(user) {
    //used to be createArticle
    var userExists = null
    var userData = null

    const snapshot = await getDocs(
        query(collection(db, 'users'), orderBy('userName', 'desc'), limit(20))
    )

    const userMap = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))

    for (const index in userMap){
        if(userMap[index].userName === user.user.displayName){
            userExists = true
            userData = userMap[index]
        }
    }
    if (!userExists === true){
        userExists = false
    }

    if (userExists === false){
        let times = 1
        console.log('CREATING USER')
        
        console.log('sucess')
        console.log("display name: ", user)
        let ref = doc(db, "users", user.user.uid);
        
        const docRef = await setDoc(ref, {
            userName: user.user.displayName,
            timesSignedIn: times
        })
    } else if(userExists === true) {
        console.log(user.user.displayName, "  is already a user in the database")
        let ref = doc(db, "users", user.user.uid);

        console.log( userData.timesSignedIn)
        let newTimes = userData.timesSignedIn + 1

        const docRef = await setDoc(ref, {
            userName: user.user.displayName,
            timesSignedIn: newTimes
        })

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
