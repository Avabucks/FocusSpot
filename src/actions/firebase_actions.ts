"use client";
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup, getAuth, signOut } from "firebase/auth";
import { saveUser, getUsername, getUser } from "@/src/actions/users_actions";
import { deleteCookie, setCookie } from "cookies-next";

export async function firebaseLogIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    await saveUser(user.displayName || "", user.email || "", user.uid || "", user.photoURL || "", token);
    const uname = await getUsername(user.uid || "");

    const userCookie = {
      uid: user.uid,
      username: uname,
    };

    setCookie("user", JSON.stringify(userCookie), { maxAge: 365 * 24 * 60 * 60 });

    const returnUser = await getUser(uname, user.uid)
    return returnUser

  } catch (error) {
    console.error("Errore durante il login:", error);
    return false
  }

}

export async function firebaseLogOut() {
  const auth = getAuth();

  try {
    await signOut(auth);
    deleteCookie("user");
    console.log("Logout effettuato con successo!");

    return true
  } catch (error) {
    console.error("Errore durante il logout:", error);
    return false
  }
};