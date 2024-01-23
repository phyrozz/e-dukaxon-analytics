import { useState } from 'react';
import logOut from '@/firebase/auth/signout';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Menu, MenuItem, IconButton, Divider, Button } from '@mui/material';
import { AccountCircleRounded } from '@mui/icons-material';

const AdminNavbar = (props) => {
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
        </div>
        <Button variant="text" onClick={handleAccountMenu} color="inherit" endIcon={<AccountCircleRounded />}>
          Admin
        </Button>
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
  );
};

export default AdminNavbar;
