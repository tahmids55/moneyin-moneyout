import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/config'

export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logoutUser() {
  return signOut(auth)
}
