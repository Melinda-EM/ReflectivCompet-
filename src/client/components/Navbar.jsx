import { Link } from 'react-router-dom'
import { useUser } from '../hooks/user'

function Navbar() {
  const { isConnected, logout } = useUser()

  return (
    <>
        <nav className='bg-white border-gray-200 mb-20'>
            <div className='hidden w-full md:block md:w-auto h-12'>
                <ul className='font-medium grid grid-cols-4 p-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-red items-center'>
                    <li><img src="assets/Reflectiv.png" className="w-24" /></li>
                    <li><Link className='text-white font-serif text-2xl font-bold' to="/">Accueil</Link></li>
                    {isConnected && <li><Link className='text-white font-serif text-2xl font-bold' to="/admin">Admin</Link></li>}
                    {isConnected ? <li><span className='text-white font-serif text-2xl font-bold cursor-pointer' onClick={logout}>Déconnexion</span></li> : <li><Link className='text-white font-serif text-2xl font-bold cursor-pointer' to="/login">Connexion</Link></li>}
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar