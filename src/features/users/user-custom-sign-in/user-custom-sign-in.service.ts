import { auth} from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import Cookies from 'js-cookie';

const CustomSignInService = async (userData: {
  email: string;
  password: string;
}) => {
  const { email, password } = userData;
  const response = await signInWithEmailAndPassword(auth, email, password);
  console.log(response.user , "Response from signInWithEmailAndPassword");
//   const userName = auth.currentUser?.displayName;
  Cookies.set('currentUser', response.user.uid, { expires: 7, secure: true });
  const cleanData = {
    uid : response.user.uid,
    email : response.user.email,
    displayName : response.user.displayName
  };

  return cleanData;
};

export default CustomSignInService;
