// Conexao com o Firebase (projeto site-amendola).
//
// Os valores abaixo NAO sao senha: o firebaseConfig fica visivel no site de
// qualquer jeito. Quem protege os dados sao as regras em firestore.rules.
// Copie de: Console do Firebase > Configuracoes do projeto > Seus apps > Web.
//
// Ao atualizar a versao do SDK, troque TODAS as URLs gstatic (aqui e em
// assets/js/admin.js) para a mesma versao, senao o Firestore quebra.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeW1KWjvb5qmbls4Aj-GkX-BsJbziieWI",
  authDomain: "site-amendola.firebaseapp.com",
  projectId: "site-amendola",
  storageBucket: "site-amendola.firebasestorage.app",
  messagingSenderId: "338870257529",
  appId: "1:338870257529:web:5c8e73086af2b340c351a8"
};

export const configurado = !Object.values(firebaseConfig).includes("COLE_AQUI");
export const app = configurado ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

async function carregarLocal(arquivoLocal) {
  const resposta = await fetch(arquivoLocal, { cache: "no-cache" });
  if (!resposta.ok) throw new Error(`Erro ao carregar ${arquivoLocal}`);
  return { dados: await resposta.json(), origem: "local" };
}

// Se o Firebase nao estiver configurado, falhar, ou a colecao ainda estiver
// vazia (antes da importacao pelo admin), as paginas publicas usam os arquivos
// de data/ (a copia dos dados feita na migracao), para o site nao ficar vazio.
export async function carregarColecao(nome, arquivoLocal) {
  if (!db) return carregarLocal(arquivoLocal);

  try {
    const snap = await getDocs(collection(db, nome));
    if (!snap.empty) {
      return { dados: snap.docs.map((d) => ({ id: d.id, ...d.data() })), origem: "firebase" };
    }
    console.warn(`Colecao "${nome}" vazia no Firestore; usando ${arquivoLocal}.`);
  } catch (err) {
    console.warn(`Firestore indisponivel para "${nome}"; usando ${arquivoLocal}.`, err);
  }
  return carregarLocal(arquivoLocal);
}
