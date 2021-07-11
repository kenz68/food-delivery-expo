import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    Image,
    TouchableOpacity,
    Vibration
} from 'react-native';

import { Audio } from 'expo-av';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { LinearGradient } from 'expo-linear-gradient';
import { icons, images, sounds, SIZES, COLORS, FONTS, GOOGLE_API_KEY } from '../constants';

export default function OrderDelivery({ route, navigation }) {

    const mapView = React.useRef()

    const [sound, setSound] = React.useState();

    const [restaurant, setRestaurants] = React.useState(null);
    const [streetName, setStreetName] = React.useState('');
    const [fromLocation, setFromLocation] = React.useState(null);
    const [toLocation, setToLocation] = React.useState(null);
    const [region, setRegion] = React.useState(null);

    const [duration, setDuration] = React.useState(0);
    const [isReady, setisReady] = React.useState(false);
    const [angle, setAngle] = React.useState(0);


    async function click() {
        const { sound } = await Audio.Sound.createAsync(sounds.click);

        setSound(sound);
        await sound.playAsync();
        Vibration.vibrate();
    }

    React.useEffect(() => {
        return sound
              ? () => {sound.unloadAsync(); }
              : undefined;
    }, [sound]);

    React.useEffect(() => {
        let { restaurant, currentLocation } = route.params;


        let fromLoc = currentLocation.gps;
        let toLoc = restaurant.location;
        let street = currentLocation.streetName;

        let mapRegion = {
            latitude: (fromLoc.latitude + toLoc.latitude) / 2,
            longitude: (fromLoc.longitude + toLoc.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2
        }

        setRestaurants(restaurant);
        setStreetName(street);
        setFromLocation(fromLoc);
        setToLocation(toLoc);
        setRegion(mapRegion);

    },[]);

    function ZoomIn() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2
        }

        setRegion(newRegion);
        mapView.current.animateToRegion(newRegion, 200);
        click()
    }

    function ZoomOut() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2
        }

        setRegion(newRegion);
        mapView.current.animateToRegion(newRegion, 200);
        click()
    }

    function renderMap() {

        function destinationMarker() {

            if (! toLocation) {
                return null
            }

            return(
                <Marker
                    coordinate={toLocation}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white,
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.primary,
                            }}
                        >
                            <Image
                                source={icons.pin}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: COLORS.white
                                }}
                            />
                        </View>
                    </View>
                </Marker>
            );
        }

        function shipper() {
            if (! fromLocation) {
                return null;
            }

            return (
                <Marker
                    coordinate={fromLocation}
                    anchor={{ x:0.5, y: 0.5}}
                    flat={true}
                    rotation={angle}
                >
                    <Image
                        source={icons.car}
                        resizeMode='contain'
                        style={{
                            width: 40,
                            height: 40
                        }}
                    />
                </Marker>
            );
        }

        function calculateAngle(coordinates) {
            let startLat = coordinates[0]['latitude'];
            let startLng = coordinates[0]['longitude'];
            let endLat = coordinates[1]['latitude'];
            let endtLng = coordinates[1]['longitude'];
            let dx = endLat - startLat;
            let dy = endtLng - startLng;

            return Math.atan2(dy, dx) * 180 / Math.PI;
        }

        return (
            <View style={{ flex: 1 }} >
                <MapView 
                    ref={mapView}
                    provider={ PROVIDER_GOOGLE }
                    initialRegion = {region}
                    style={{ flex: 1 }} 
                >
                    <MapViewDirections
                        origin={fromLocation}
                        destination={toLocation}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor={COLORS.primary}
                        optimizeWaypoints={true}
                        onReady={(result) => {
                            setDuration(result.duration)
                            if (! isReady) {
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom:  (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top:  (SIZES.height / 8)
                                    }
                                })
                                let nextLoc = {
                                    latitude: result.coordinates[0]['latitude'],
                                    longitude: result.coordinates[0]['longitude']
                                }
                                if (result.coordinates.length >= 2) {
                                    let angle = calculateAngle(result.coordinates);
                                    setAngle(angle);
                                }

                                setFromLocation(nextLoc);
                                setisReady(true);
                            }
                        }}
                    />
                    {destinationMarker()}
                    {shipper()}
                </MapView>
            </View>
        );
    }

    function renderDestinationHeader() {
        return(
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 0,
                    right: 0,
                    height: 50,
                    alignItems: 'center', 
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: SIZES.width * 0.9,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding *2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                    <Image
                        source={icons.red_pin}
                        style={{
                            width: 30,
                            height: 30,
                            marginRight: SIZES.padding
                        }}
                    />
                    <View
                        style={{ flex: 1 }}
                    >
                        <Text style={{...FONTS.body3}}>{streetName}</Text>
                    </View>
                    <Text style={{...FONTS.body3}}>{Math.ceil(duration)} min</Text>
                </View>
            </View>
        );
    }

    function renderDeliveryInfo() {
        return(
            <View
                style={{
                    position: 'absolute',
                    bottom: 25,
                    left: 0,
                    right: 0,
                    alignItems: 'center', 
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        width: SIZES.width * 0.9,
                        paddingVertical: SIZES.padding * 3,
                        paddingHorizontal: SIZES.padding *2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                     <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', 
                        }}
                    >
                        <Image
                            source={restaurant?.courier.avatar}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            }}
                        />
                        <View
                            style={{ 
                                flex: 1, 
                                marginLeft: SIZES.padding
                            }}
                        >
                            <View
                                style={{ 
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text style={{...FONTS.h4}}>{restaurant?.courier.name}</Text>
                                <View
                                    style={{ flexDirection: 'row' }}
                                >
                                    <Image
                                        source={icons.star}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            tintColor: COLORS.primary,
                                            marginRight: SIZES.padding
                                        }}
                                    />
                                    <Text style={{...FONTS.body3}}>{restaurant?.rating}</Text>
                                </View>
                            </View>
                            <Text style={{color:COLORS.darkgray,...FONTS.body4}}>{restaurant?.name}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row', 
                            marginTop: SIZES.padding * 2,
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={() => {
                                navigation.navigate("Home")
                                click()
                            }}
                        >
                             <LinearGradient 
                                colors={['#faa51a', '#f47a20']}
                                style={{
                                    height: 50,
                                    marginRight: 10,
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: 10
                                }}
                            >
                                <Text style={{color:COLORS.white,...FONTS.h4}}>Call</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1
                            }}
                            onPress={() => {
                                navigation.goBack();
                                click();
                            }}
                        >
                            <LinearGradient 
                                colors={['#aba8a8', '#928f8f']}
                                style={{
                                    height: 50,
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: 10
                                }}
                            >
                                <Text style={{color:COLORS.white,...FONTS.h4}}>Cancel</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    function renderZoomMap() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: SIZES.height * 0.35,
                    right: SIZES.padding * 2,
                    width: 60,
                    height: 130,
                    justifyContent: 'space-between'
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        backgroundColor: COLORS.white,
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: 30
                    }}
                    onPress={() => ZoomIn()}
                >
                    <Text style={{...FONTS.body1}}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        backgroundColor: COLORS.white,
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: 30
                    }}
                    onPress={() => ZoomOut()}
                >
                    <Text style={{...FONTS.body1}}>-</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View
            style={{ flex: 1 }}
        >
            {renderMap()}
            {renderDestinationHeader()}
            {renderDeliveryInfo()}
            {renderZoomMap()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
