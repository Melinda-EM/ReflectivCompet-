import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from "axios"

function AdminPage() {
  const [importSuccess, setImportSuccess] = useState(false);

  function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const date = new Date()
    const formData = new FormData()
    formData.append("file", file)
    axios.post("/api/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { date: `${String(date.getDay()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}` }
    }).then(() => setImportSuccess(true))
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
      <div className="bg-zinc-300 rounded-md p-8 flex flex-col items-center justify-center">
          <h1 className='text-3xl font-serif font-bold mb-4 text-gray-800'>Importer les données pour mettre à jour le graphique</h1>
          <p className="text-gray-800 mb-6 font-serif text-lg">Merci de tenir à jour le graphique grâce à la transmission de fichiers via ce bouton.</p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="bg-red text-white text-lg font-serif px-8 py-4 rounded-full hover:bg-black transition duration-300 ease-in-out"
            >
              Importer depuis un fichier JSON
            </label>
      </div>
      {/* <div>
        <h1>Liste des fichiers importés</h1>
        <button>Supprimer</button>
      </div> */}
        {importSuccess && (
          <div className="bg-green-200 text-green-800 p-2 rounded mt-2 h-12">
            Données importées avec succès !
          </div>
        )}
      </div>
    </>
  );
}

export default AdminPage;
