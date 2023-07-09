import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Box,
    Text,
    Input, 
    Textarea,
    useToast
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

const Write: React.FC = () => {
    const [content, setContent] = useState("");

    const showToast = useToast();

    useEffect(() => {

    }, []);

    let post = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let {data, error} = await supabase.rpc("create_post", {"user_contents": content});
        if(error){
            showToast({title: error.message, duration: 5000});
        } else {
            setContent("");
            showToast({title: "Post successful!", duration: 5000});
        }
    }

    return (
        <Container>
            <form onSubmit={post}>
                <Box>
                    <Text>Content</Text>
                    <Input type="text" value={content} 
                        placeholder="Content" 
                        onChange={(event) => {console.log(event)}}
                    />

                </Box>
                <div className="ion-text-center">
                    <Button type="submit" fill="clear">
                        Post
                    </Button>
                </div>
            </form>
        </Container>
    )
}

export default Write;