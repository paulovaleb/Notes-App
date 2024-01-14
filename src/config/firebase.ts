import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlIcI6abGDw2coPr3oKhGY4ArKaxKhmOQ",
  authDomain: "notes-app-dc460.firebaseapp.com",
  databaseURL: "https://notes-app-dc460-default-rtdb.firebaseio.com",
  projectId: "notes-app-dc460",
  storageBucket: "notes-app-dc460.appspot.com",
  messagingSenderId: "862368343629",
  appId: "1:862368343629:web:6db40b62a36d01cd151e04",
  measurementId: "G-VHL7TF0K3G"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export { db};