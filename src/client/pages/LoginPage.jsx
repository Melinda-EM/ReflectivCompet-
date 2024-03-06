import { useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../hooks/user";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login } = useUser()
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    function handleSubmit(event) {
        event.preventDefault()
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");
        if (!username || !password) return;

        login(username, password).then((success) => {
            if (success) {
                setError(null)
                navigate("/")
            } else {
                setError("Couldn't login")
            }
        })
    }

    return <>
        <Navbar />
        <div className="container mx-auto p-4">
        <form className="bg-zinc-300 rounded-md flex flex-col items-center justify-center p-7" onSubmit={handleSubmit}>
            {error && <span className="text-red-500">{error}</span>}
            <div className="flex flex-col gap-1 w-fit text-xl mb-4">
                <label htmlFor="username">Nom d'utilisateur:</label>
                <input type="text" id="username" name="username" className="border-black border-2" />
            </div>
            <div className="flex flex-col gap-1 w-fit mb-4 text-xl">
                <label htmlFor="password">Mot de passe:</label>
                <input type="password" id="password" name="password" className="border-black border-2" />
            </div>
            <button className="bg-red text-white text-xl font-serif px-12 py-2 rounded-full hover:bg-black transition duration-300 ease-in-out">Envoyer</button>
        </form>
        </div>
    </>
}