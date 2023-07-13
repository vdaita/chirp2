import {SimpleGrid, HStack, Heading, Box, Container, Button} from '@chakra-ui/react';

import { Posts } from './Posts';
import { Search } from './Search';
import Authentication from './Authentication';
import Write from './Write';
import { Settings } from './Settings';
import { useState, useEffect } from 'react';
import './Home.css';
import { supabase } from '../supabaseClient';

const Home = () => {

  const [view, setView] = useState("Posts");
  const [user, setUser] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if(session) {
        setUser(session.user);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  return (
    <Container>
      <Box>
        <HStack columns={[4, 1]}>
          <Button onClick={() => setView("Posts")} fill="outline">Posts</Button>
          <Button onClick={() => setView("Search")} fill="outline">Search</Button>
          <Button onClick={() => setView(user ? "Write" : "Authentication")} fill="outline">Write</Button>
          <Button onClick={() => setView(user ? "Settings" : "Authentication")} fill="outline">Settings</Button>
        </HStack>
        <Heading><b>{view}</b></Heading>
        {view === "Posts" && <Posts/>}
        {view === "Search" && <Search/>}
        {view === "Write" && <Write/>}
        {view === "Settings" && <Settings/>}
        {view === "Authentication" && <Authentication/>}
      </Box>

    </Container>
  );
};

export default Home;
