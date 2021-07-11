import React from 'react';
import {
    Text, 
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Vibration,
    Platform,
    AsyncStorage,
    TextInput
} from 'react-native';

import axios from 'axios';
import { Audio } from 'expo-av';
import Bgtop from '../assets/svg/bg-top.svg';
import Logo from '../assets/svg/mobile-login.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { icons, images, sounds, SIZES, COLORS, FONTS, USERS, LG } from '../constants';

export default function User({ navigation }) {

    const [sound, setSound] = React.useState();
    const [user, setUser] = React.useState({role: USERS.guest, info: null});

    async function click() {
        const { sound } = await Audio.Sound.createAsync(sounds.click);

        setSound(sound);
        await sound.playAsync();
        Vibration.vibrate();
    }
    const currentUser = async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(user || {role: USERS.guest, info: null});
    };

    React.useEffect(() => {
        return sound
              ? () => {sound.unloadAsync(); }
              : undefined;
    }, [sound]);


    // let testUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=f7bbdc43-c568-4e60-9afa-b77ba5a14aa0&filters=%7B%22vehicle_class%22:%20%22Category%20D%22%7D&sort=month%20desc&limit=1';

    // axios({
    //     url: testUrl,
    //     method: 'GET',
    //     header: {
    //         Accept: 'application/json'
    //     }
    // }).then( result => 
    //     console.log('api')
    // )
    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    height: 200

                }}
            >
                <View
                    style={{ 
                        width: '100%',
                        hieght: 200,
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}
                >
                    <Logo width={100} hieght={100} />
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        alignItems: 'center', 
                        justifyContent: 'center'
                    }}>
                        <Text style={{...FONTS.h3}}>Viet Foods Delivery</Text>
                    </View>
                </View>
                <Bgtop width={170} hieght={198} style={{
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}/>
            </View>
        );
    }

    function renderLoginForm() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center', 
                justifyContent: 'center'
            }}>
                <View style={{
                    width:SIZES.width * 0.8,
                    backgroundColor: COLORS.white,
                    borderRadius: SIZES.radius * 0.5,
                    padding: SIZES.padding,
                    alignItems: 'center', 
                    justifyContent: 'center'
                }}
                >
                    <Text style={{...FONTS.body3, marginBottom: SIZES.padding}}>Member area</Text>
                    <TextInput 
                        style={{
                            width: '100%',
                            backgroundColor: COLORS.lightGray3,
                            marginBottom: SIZES.padding,
                            padding: SIZES.padding, 
                            borderRadius: SIZES.radius * 0.3
                        }} 
                        placeholder='Email ...'
                        autoCompleteType='email'
                    />
                    <TextInput 
                        style={{
                            width: '100%',
                            backgroundColor: COLORS.lightGray3,
                            marginBottom: SIZES.padding,
                            padding: SIZES.padding, 
                            borderRadius: SIZES.radius * 0.3
                        }} 
                        placeholder='Password ...'
                        autoCompleteType='password'
                    />
                    <Text style={{alignSelf: 'flex-end',...FONTS.body5, marginBottom: SIZES.padding}}>Forgot Password?</Text>
                    <View
                        style={{ 
                            padding: SIZES.padding * 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            //onPress={() => {click()}}
                        >
                            <LinearGradient 
                                colors={['#faa51a', '#f47a20']}
                                style={{
                                    width: SIZES.width * 0.5,
                                    padding: SIZES.padding,
                                    alignItems: 'center',
                                    borderRadius: 25
                                }}
                            >
                                <Text style={{color: COLORS.white,...FONTS.h2}}>Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                <Text style={{...FONTS.body5, marginVertical: SIZES.padding}}>Don't have an Account? </Text>
                <Text style={{...FONTS.body5, marginVertical: SIZES.padding, color: COLORS.primary}}>Get one now!</Text>
                </View>
            </View>
        );
    }

    function loginForm() {
        return (
            <View style={{ flex: 1}}
            >
                {renderHeader()}
                {renderLoginForm()}
            </View>
        );
    }

    return (
        (user.role == USERS.guest) ? loginForm(): null
    );
}