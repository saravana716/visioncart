import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc3zvHoU9jvR1KkB1xpLLZExm4Xq3tdNs",
  authDomain: "visionkart---e-commerce.firebaseapp.com",
  projectId: "visionkart---e-commerce",
  storageBucket: "visionkart---e-commerce.firebasestorage.app",
  messagingSenderId: "284466667171",
  appId: "1:284466667171:web:1fd940de4c2cf7e5632916"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  console.log("Total products fetched:", querySnapshot.size);
  const products = querySnapshot.docs.map(doc => doc.data());
  console.log("Sample product fields:", products[0] ? Object.keys(products[0]) : "No products");
  
  const filters = {
    gender: new Set(),
    frameType: new Set(),
    frameShape: new Set(),
    frameMaterial: new Set(),
    lensType: new Set(),
    brand: new Set(),
    frameColor: new Set(),
    frameSize: new Set()
  };

  products.forEach(p => {
    if (p.gender) filters.gender.add(p.gender);
    if (p.frameType) filters.frameType.add(p.frameType);
    if (p.frameShape) filters.frameShape.add(p.frameShape);
    if (p.frameMaterial) filters.frameMaterial.add(p.frameMaterial);
    if (p.lensType) filters.lensType.add(p.lensType);
    if (p.brand) filters.brand.add(p.brand);
    if (p.frameColor) filters.frameColor.add(p.frameColor);
    if (p.frameSize) filters.frameSize.add(p.frameSize);
  });

  console.log("Aggregated filters:", {
    gender: Array.from(filters.gender),
    frameType: Array.from(filters.frameType),
    frameShape: Array.from(filters.frameShape),
    frameMaterial: Array.from(filters.frameMaterial),
    lensType: Array.from(filters.lensType),
    brand: Array.from(filters.brand),
    frameColor: Array.from(filters.frameColor),
    frameSize: Array.from(filters.frameSize)
  });
}

run().catch(console.error);
