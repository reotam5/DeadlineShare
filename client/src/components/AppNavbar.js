import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, Typography, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function AppNavbar() {
  const [ menuOpen, setMenuOpen ] = useState(false);
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>{
          setMenuOpen(true);
        }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          DeadlineShare
        </Typography>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              console.log("You pressed profile button");
            }}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
      <Drawer anchor="left" open={menuOpen} onClose={()=>{setMenuOpen(false)}}>
        <div
          role="presentation"
          onClick={()=>setMenuOpen(false)}
          onKeyDown={()=>setMenuOpen(false)}
        >
          <List>
            <ListItem button>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="My Schedule" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Groups" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </AppBar>
  );
}

export default AppNavbar;