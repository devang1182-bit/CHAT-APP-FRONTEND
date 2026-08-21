import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";

const CustomSignUpService = async (userData: {
  email: string;
  password: string;
  displayName: string;
}) => {
  const { email, password, displayName } = userData;

  const response = await createUserWithEmailAndPassword(auth, email, password);

  if (response) {
    await setDoc(doc(db, "users", response.user.uid), {
      email,
      displayName,
      createdAt: serverTimestamp(),
    });
  }
  Cookies.set("currentUser", response.user.uid, { expires: 7, secure: true });

  const cleanData = {
    uid: response.user.uid,
    email: response.user.email,
    displayName: response.user.displayName,
  };
  
  return cleanData;
};

export default CustomSignUpService;
