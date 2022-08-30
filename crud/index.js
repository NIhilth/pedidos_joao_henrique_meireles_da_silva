const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc
} = require('firebase/firestore/lite');

const firebaseConfig = {
  apiKey: "AIzaSyA-RU_ExmHYSjd1YRuHELhfcrhEi_ti0wQ",
  authDomain: "pedidos-joao-cloud.firebaseapp.com",
  projectId: "pedidos-joao-cloud",
  storageBucket: "pedidos-joao-cloud.appspot.com",
  messagingSenderId: "767653234076",
  appId: "1:767653234076:web:acc49db85e1e7ac8f6f459",
  measurementId: "G-PHZ0C6402J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function save(nomeTabela, id, dado) {
  if (id) {
      const entidadeReferencia = await setDoc(doc(db, nomeTabela, id), dado);
      const dataSalva = {
          ...dado,
          id: id
      }
      return dataSalva;
  } else {
      const entidadeReferencia = await addDoc(collection(db, nomeTabela), dado);
      const dataSalva = {
          ...dado,
          id: entidadeReferencia.id
      }
      return dataSalva;
  }
}

async function get(nomeTabela) {
  const tabelaRef = collection(db, nomeTabela);

  const q = query(tabelaRef);
  
  const querySnapshot = await getDocs(q);
  
  const lista = [];
  querySnapshot.forEach((doc) => {
      const dado = {
          ...doc.data(),
          id: doc.id
      }
      lista.push(dado);
  });
  return lista;
}

async function getById(Tablename, id) {
  const docRef = doc(db, Tablename, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      return docSnap.data();
  } else {
      throw new Error("404 - not found");
  }

}

async function remove(nomeTabela, id){
  const dado = await deleteDoc(doc(db, nomeTabela, id));
  return {
      message: `${id} deleted`
  }
}

module.exports = {
  save,
  get,
  getById,
  remove
}