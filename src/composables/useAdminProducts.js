import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

export function useAdminProducts() {
  const addProduct = async (album) => {
    await addDoc(collection(db, "products"), {
      title: album.title,
      artist: album.artist || album.title.split("-")[0].trim(),
      cover: album.cover_image,
      year: album.year || null,
      price: 19.99, // set default or ask admin to input
      stock: 10
    });
  };

  return { addProduct };
}
