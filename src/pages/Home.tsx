import {SimpleGrid, Box, Container, Button} from '@chakra-ui/react';

import { Posts } from './Posts';
import { Search } from './Search';
import Write from './Write';
import { Settings } from './Settings';
import { useState, useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {

  const [view, setView] = useState("Posts");

  return (
    <Container>
      <Box>
        <SimpleGrid columns={[4, 1]}>
          <Button onClick={() => setView("Posts")} fill="outline">Posts</Button>
          <Button onClick={() => setView("Search")} fill="outline">Search</Button>
          <Button onClick={() => setView("Write")} fill="outline">Write</Button>
          <Button onClick={() => setView("Settings")} fill="outline">Settings</Button>
        </SimpleGrid>
        <h1><b>{view}</b></h1>
        {view === "Posts" && <Posts/>}
        {view === "Search" && <Search/>}
        {view === "Write" && <Write/>}
        {view === "Settings" && <Settings/>}
      </Box>

    </Container>
  );
};

export default Home;
