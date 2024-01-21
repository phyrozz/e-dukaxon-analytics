import { useState } from 'react';
import logOut from '@/firebase/auth/signout';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { AccountCircleRounded } from '@mui/icons-material';

const Navbar = (props) => {
  const email = props.email
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleAccountMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <div className="flex flex-grow">
          <h1 className="text-xl font-extralight mr-3">eDukaxon</h1>
          <Button variant="text" color="inherit" onClick={() => router.push("/home")}>Dashboard</Button>
          <Button variant="text" color="inherit" onClick={() => router.push("/lessons")}>Lessons</Button>
        </div>
        <IconButton
          size='large'
          onClick={handleAccountMenu}
          color="inherit"
        >
          <AccountCircleRounded />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div className="p-4">
            <h2 className="text-md">{email}</h2>
          </div>
          <Divider />
          <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
          <MenuItem onClick={handleLogOut}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

    // Old navbar layout
    // <nav>
    //   <div className="sticky top-0 bg-slate-700 text-slate-50 flex justify-between items-center">
    //     <div>
    //         <Link className='hover:bg-slate-800 px-6 py-2 rounded-md transition' href="/admin">Dashboard</Link>
    //         <Link className='hover:bg-slate-800 px-6 py-2 rounded-md transition' href="/lessons">Lessons</Link>
    //     </div>
    //     <button className='hover:bg-slate-800 px-6 py-2 rounded-md transition justify-end' onClick={handleLogOut}>Log Out</button>
    //   </div>
    // </nav>
  );
};

export default Navbar;
