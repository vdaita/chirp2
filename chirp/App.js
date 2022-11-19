import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import UserProfile from './screens/UserProfile';
import styles from './screens/styles';
import { supabase } from './lib/supabase';
import PostView from './components/PostView';
import SwitchSelector from "react-native-switch-selector";
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

function CreatePost(){
  const [postContent, setPostContent] = useState("");
  
  let post = () => {

    if(postContent.length > 300){
      Toast.show({
        type: 'error',
        text1: 'too many characters'
      })
    } else {
      supabase.rpc("create_post", {'user_contents': postContent}).then(({data, error}) => {
        console.log(data, error);
        if(error){
          Toast.show({
            type: 'error',
            text1: error["message"]
          })
        } else {
          setPostContent("");
          Toast.show({
            type: 'success',
            text1: 'posted successfully'
          })
        }
      });
    }
  }

  return (
    <View style={{...styles.container, height: 200, margin: 10, justifyContent: 'flex-start'}}>
      <TextInput style={{textAlignVertical: 'top'}} multiline={true} editable={postContent.length < 300} value={postContent} onChangeText={(value) => setPostContent(value)} style={{...styles.textInput, height: 100}}/>
      <Text>{postContent.length}/300 characters</Text>
      <TouchableOpacity style={styles.button} onPress={() => post()}>
        <Text>Post</Text>
      </TouchableOpacity>
    </View>
  )
}

function Settings(){

    const [user, setUser] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        getData();
    }, []);

    let getData = () => {
      supabase.auth.getUser().then((data) => {
          console.log("user data", data);
          const user = data["data"]["user"];
          supabase
          .from('user_data')
          .select()
          .eq('id', user["id"])
          .limit(1)
          .single()
          .then(({data, error}) => {
              console.log("settings", data, error);
              setUser(data["username"]);
              setBio(data["bio"]);
          })
      });
    }

    let updateBio = () => {
        supabase.
            from('user_data')
            .update({bio: bio})
            .eq('username', user)
            .then(({error}) => {
              if(!error){
                Toast.show({
                  type: 'success',
                  text1: "bio successfully updated"
                })
              } else {
                console.log(error);
                Toast.show({
                    type: "error",
                    text1: error.message
                });
              }
            });
    }

    return (
        <View style={styles.container}>
              <TouchableOpacity style={{...styles.button, alignSelf: "flex-start"}} onPress={() => supabase.auth.signOut()}><Text>Sign out</Text></TouchableOpacity>
            <Text >
                Stories are the ephemeral sharing of moments.
                Tweets are the permanent sharing of state of mind.
                Chirps are the ephemeral sharing of state of mind.
            </Text>
            <View style={{...styles.row, marginLeft: 0, alignContent: 'center'}}>
              <Text>Your username is</Text>
              <Text style={{fontWeight: 'bold'}}> {user}</Text>
            </View>
            <Text>Your bio is</Text>
            <TextInput style={{...styles.textInput, textAlignVertical: 'top', height: 50}} multiline={true} autoCapitalize='none' value={bio} onChangeText={(value) => setBio(value)}></TextInput>
            <TouchableOpacity onPress={() => updateBio()} style={styles.button}><Text>Update</Text></TouchableOpacity>
        
        </View>
    )
}

function SearchUsers() {

  const [users, setUsers] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [currentUserProfile, setCurrentUserProfile] = useState(false);
  const [currentProfileVisible, setCurrentProfileVisible] = useState(false);
  
  let search = async () => {
      let {data, error} = await supabase.rpc('search_users', {
          searchquery: searchQuery
      });
      setUsers(data);
      if(error) console.error(error)
      else console.log(data)
  }

  let openUser = (item) => {
    setCurrentUserProfile(item);
    setCurrentProfileVisible(true);
  }

  let renderItem = ({ item }) => {
      return (
          <TouchableOpacity style={styles.card} onPress={() => openUser(item)}>
              <Text style={{fontWeight: 'bold'}}>{item.username}</Text>
              <Text>{item.bio}</Text>
          </TouchableOpacity>
      )
  }

  return (
      <View style={styles.container}>
          <Text>Search Users</Text>
          <View style={styles.row}>
              <TextInput 
                  autoCapitalize="none"
                  style={{...styles.textInput, width: 300}} 
                  value={searchQuery} 
                  onChangeText={(value) => setSearchQuery(value)}>    
              </TextInput>
              <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => search()}>
                      <Text>Search</Text>
              </TouchableOpacity>
          </View>
          <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
          >
          </FlatList>

          <Modal visible={currentProfileVisible}>
            <SafeAreaView style={styles.container}>
              <UserProfile user={currentUserProfile}/>
              <TouchableOpacity style={{...styles.button, height: 40}} onPress={() => setCurrentProfileVisible(false)}>
                <Text style={{fontSize: 20}}>❌</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
      </View>
  )
}

function Posts(){

  const [posts, setPosts] = useState([]);
  const [feedSource, setFeedSource] = useState("recent");

  const [currentUserProfile, setCurrentUserProfile] = useState(false);
  const [currentUserProfileVisible, setCurrentUserProfileVisible] = useState(false);

  useEffect(() => {
      getRecentData();
      console.log("posts use effect");
  }, []);

  let getFollowingData = () => {
      console.log("running get following data");
      supabase.rpc("get_following_posts").then(({data, error}) => {
          setPosts(data);
          console.log(data, error);
          setFeedSource("following");
      });
  }
  
  let getRecentData =  () => {
      console.log("running get recent data")
      supabase.rpc("get_recent_posts").then(({data, error}) => {
          setPosts(data);
          console.log(data, error);
          setFeedSource("recent");
      });
  }

  let refresh = () => {
      if(feedSource == "following"){
          getFollowingData();
      } else {
          getRecentData();
      }
  }

  let showModal = (item) => {
    setCurrentUserProfile(item);
    setCurrentUserProfileVisible(true);
  }

  let renderItem = ({item, index, separators}) => (
      <PostView data={item} onUsernamePress={() => showModal(item)}/>
  )

  return (
      <View style={styles.container}>
          <SwitchSelector
              initial={0}
              options={[
                  {label: "Recent", value: "recent"},
                  {label: "Following", value: "following"}
              ]}
              onPress={value => (value == "recent" ? getRecentData() : getFollowingData())}
              
              textColor={'#000000'}
              selectedColor={'#FFFFFF'}
              buttonColor={"#000000"}
              borderColor={'#000000'}
              hasPadding
          />
          {/* <Text>{feedSource}</Text> */}
          <TouchableOpacity style={styles.button} onPress={() => refresh()}>
              <Text>
                  Refresh
              </Text>
          </TouchableOpacity>
          <FlatList
              data={posts}
              renderItem={renderItem}
              keyExtractor={item => item.id}
          />

          <Modal visible={currentUserProfile != false ? true : false} style={{backgroundColor:"#FFFFFF"}}>
            <SafeAreaView style={{...styles.container, backgroundColor: "#FFFFFF"}}>
              <UserProfile user={currentUserProfile}/>
              <TouchableOpacity style={styles.button} onPress={() => setCurrentUserProfile(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
      </View>
  )
}
function AuthUI(){

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formType, setFormType] = useState("signup");

  let signup = async () => {

      const usernameAlreadyExists = await supabase.from('user_data').select('*', {count: 'exact', head: true}).eq('username', username);
      console.log(usernameAlreadyExists);
      if(usernameAlreadyExists["count"] == 0){
          const {data, error} = await supabase.auth.signUp({
              email: email,
              password: password
          });
          console.log(data, error);
          Toast.show({
              type: 'error',
              text1: error.message
          })

          if(!error){
              const ret2 = await supabase.rpc('create_user', {'user_id': data["user"]["id"], 'username': username, 'bio': ''});
              console.log(ret2);

              if(!ret2["error"]){
                  Toast.show({
                      type: 'success',
                      text1: 'Signup successful! Please confirm your email.'
                  })
              } else {
                  Toast.show({
                      type: 'error',
                      text1: error.message
                  })
              }
          }

          
      }
  };

  let login = async () => {
      const {data, error} = await supabase.auth.signInWithPassword({
          email: email,
          password: password
      });
      console.log(data, error);

      if(error){
          Toast.show({
              type: 'error',
              text1: error.message
          });
      }
  }

  return (
      <SafeAreaView style={styles.childContainer}>
          <SwitchSelector
              options={[
                  {label: "Signup", value: "signup"},
                  {label: "Login", value: "login"}
              ]}
              onPress={value => setFormType(value)}
              
              textColor={'#000000'}
              selectedColor={'#FFFFFF'}
              buttonColor={"#000000"}
              borderColor={'#000000'}
              initial={0}
              hasPadding
          />
          <View>
              {formType == "signup" && 
                  <View>
                      <Text>Username</Text>
                      <TextInput autoCapitalize="none" type={"username"} value={username} onChangeText={(value) => setUsername(value)} style={styles.textInput}></TextInput>
                  </View>
              }
              <Text>Email</Text>
              <TextInput autoCapitalize="none" type={"email"} value={email} onChangeText={(value) => setEmail(value)} style={styles.textInput}></TextInput>
              <Text>Password</Text>
              <TextInput autoCapitalize="none" secureTextEntry={true} type={"password"} value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput}></TextInput>

              <TouchableOpacity style={styles.button} onPress={formType == "signup" ? () => signup() : () => login()}>
                  <Text>{formType == "signup" ? "Signup" : "Login"}</Text>
              </TouchableOpacity>
          </View>
      </SafeAreaView>
  )
}


export default function App() {

  const [session, setSession] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("posts");

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN'){
        // console.log('SIGNED_IN', session)
        setSession(true);
      }
      if (event == 'SIGNED_OUT'){
        // console.log('SIGNED_OUT', session);
        setSession(false);
      }
    })
  })

  if(session){
    return (
      <SafeAreaView style={{flex: 1}}>

        {currentScreen == "posts" && <Posts/>}
        {currentScreen == "write" && <CreatePost/>}
        {currentScreen == "search" && <SearchUsers/>}
        {currentScreen == "settings" && <Settings/>}


        <View style={{justifyContent: "flex-end"}}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="list" onPress={() => setCurrentScreen("posts")} size={30}>
              </Icon.Button> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="edit" onPress={() => setCurrentScreen("write")} size={30}>
              </Icon.Button>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="search" onPress={() => setCurrentScreen("search")} size={30}>

              </Icon.Button>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="settings" onPress={() => setCurrentScreen("settings")} size={30}>

              </Icon.Button>
            </TouchableOpacity>
          </View>
        </View>

        <Toast/>
      </SafeAreaView>
    )
  }

  return (
    <View>
      <AuthUI/>
      <Toast/>
    </View>
  )
}

