import logOut from '@/firebase/auth/signout';
import Link from 'next/link';

const Navbar = () => {
  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <nav>
      <div className="sticky top-0 bg-slate-700 text-slate-50 flex justify-between items-center">
        <div>
            <Link className='hover:bg-slate-800 px-6 py-2 rounded-md transition' href="/admin">Dashboard</Link>
            <Link className='hover:bg-slate-800 px-6 py-2 rounded-md transition' href="/lessons">Lessons</Link>
        </div>
        <button className='hover:bg-slate-800 px-6 py-2 rounded-md transition justify-end' onClick={handleLogOut}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
