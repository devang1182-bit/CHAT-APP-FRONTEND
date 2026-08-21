import { auth, db, provider } from "@/firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";

const GoogleSignInService = async () => {
  const response = await signInWithPopup(auth, provider);
  await setDoc(
    doc(db, "users", response.user.uid),
    {
      email: response.user.email,
      displayName: response.user.displayName,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  Cookies.set("currentUser", response.user.uid, { expires: 7, secure: true });
  
  const cleanData = {
    uid: response.user.uid,
    email: response.user.email,
    displayName: response.user.displayName,
  };
  return cleanData;
};

export default GoogleSignInService;
