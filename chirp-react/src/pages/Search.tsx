import React, { useEffect, useState } from 'react';
import {
    Container, Button, Input, Text, Box, VStack, useToast
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

export function Search(){
    const [users, setUsers] = useState<any[]>([]);
    const [query, setQuery] = useState("");

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let {data, error} = await supabase.rpc('search_users', {
            searchquery: query
        });
        if(data == null){
            data = [];
        }
        setUsers(data);
    }

    return (
        <Container>
            <form onSubmit={search}>
                <Box>
                    <Text>Search Term</Text>
                    <Input
                            name={"query"}
                            onChange={(e) => setQuery(e.target.value ?? '')}
                            type="text"/>
                    <Button type="submit" fill="clear">
                        Search
                    </Button>
                </Box>
            </form>
            {users.map(user => {
                return (
                    <Box>
                        <VStack>
                            <Text>
                                <h3>{user["username"]}</h3>
                            </Text>
                            <Text>
                                {user["bio"]}
                            </Text>
                        </VStack>
                    </Box>
                )
            })}
        </Container>
    )
}