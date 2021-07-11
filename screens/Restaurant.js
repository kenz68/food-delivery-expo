import React from 'react';
import {
    SafeAreaView, 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity,
    Image,
    Animated,
    Vibration
} from 'react-native';

import { isIphoneX } from 'react-native-iphone-x-helper';
import { Audio } from 'expo-av';
import { icons, images, sounds, SIZES, COLORS, FONTS } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';

export default function Restaurant({ route, navigation }) {

    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurants] = React.useState(null);
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItems, setOrderItem] = React.useState([]);

    const [sound, setSound] = React.useState();

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
        let { item, currentLocation } = route.params;

        setRestaurants(item);
        setCurrentLocation(currentLocation);
    })

function editOrder(action, menuId, price) {
        let orderList = orderItems.slice();
        let item = orderList.filter(i => i.menuId == menuId);
        if (action == '+') {

            if (item.length) {
                item[0].qty += 1;
                item[0].total = item[0].qty * price;
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem);
            }
        } else {

            if (item.length && item[0]?.qty) {
                item[0].qty -= 1;
                item[0].total = item[0].qty * price;
            } 
        }
        setOrderItem(orderList)
        click()
    }

    function getOrderQty(menuId) {
        let orderItem = orderItems.filter(i => i.menuId == menuId);

        if(orderItem.length) {
            return orderItem[0].qty;
        }
        return 0;
    }

    function getBasketItemCount(item = false) {

        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);

        if (item) {
            return itemCount > 1 ? `${itemCount} items`:  `${itemCount} item`;
        }

        return itemCount;
    }
    function sumOrder() {
        let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);

        return total.toFixed(2);
    }

    function renderHeader() {
        return(
            <View
                style={{flexDirection: 'row'}}
            >
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        navigation.goBack()
                        click()
                    }}
                >
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray3,
                            paddingHorizontal: SIZES.padding * 3
                        }}
                    >
                        <Text style={{...FONTS.h3}}>{restaurant?.name}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode='contain'
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment='center'
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false })}
            >
                {
                    restaurant?.menu.map((item, index) => (
                        <View
                            key={`menu-${index}`}
                            style={{ alignItems: 'center' }}
                        >
                            <View
                                style={{ height: SIZES.height * 0.35 }}
                            >
                                <Image 
                                    source={item.photo}
                                    resizeMode='cover'
                                    style={{
                                        width: SIZES.width,
                                        height: '100%'
                                    }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: -20,
                                        width: SIZES.width,
                                        height: 50,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        ...styles.shadow
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25
                                        }}
                                        onPress={() => editOrder('-', item.menuId, item.price)}
                                    >
                                        <Text style={{...FONTS.body1}}>-</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            width: 50,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: COLORS.white
                                        }}
                                    >
                                        <Text style={{...FONTS.h2}}>{getOrderQty(item.menuId)}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopRightRadius: 25,
                                            borderBottomRightRadius: 25
                                        }}
                                        onPress={() => editOrder('+', item.menuId, item.price)}
                                    >
                                        <Text style={{...FONTS.body1}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    marginTop: 15,
                                    paddingHorizontal: SIZES.padding * 2
                                }}
                            >
                                <Text style={{marginVertical: 10, textAlign: 'center',...FONTS.h2}}>{item.name} - ${item.price.toFixed(2)}</Text>
                                <Text style={{...FONTS.body3}}>{item.description}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10
                                }}
                            >
                                <Image
                                    source={icons.fire}
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10
                                    }}
                                />
                                <Text style={{...FONTS.body3}}>{item.calories.toFixed(2)} cal</Text>
                            </View>
                        </View>
                    ))
                }
            </Animated.ScrollView>
        );
    }

    function renderDot() {
        const dotPosition = Animated.divide(scrollX, SIZES.width);

        return (
            <View
                style={{height: 30}}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: SIZES.padding
                    }}
                >
                    { restaurant?.menu.map((item, index) => {
                        const opacity = dotPosition.interpolate({
                            inputRange: [index -1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp'
                        });

                        const dotSize = dotPosition.interpolate({
                            inputRange: [index -1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: 'clamp'
                        });

                        const dotColor = dotPosition.interpolate({
                            inputRange: [index -1, index, index + 1],
                            outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                            extrapolate: 'clamp'
                        });

                        return (
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: SIZES.radius,
                                    marginHorizontal: 6,
                                    width: dotSize,
                                    height: dotSize,
                                    backgroundColor: dotColor
                                }}
                            />
                        );

                    })}
                </View>
            </View>
        );
    }

    function renderOrder() {
        return (
            <View>
                { renderDot() }
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopRightRadius: 40,
                        borderTopLeftRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: SIZES.padding * 3,
                            paddingVertical:  SIZES.padding * 2,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{...FONTS.h3}}>{getBasketItemCount(1)} in Cart</Text>
                        <Text style={{...FONTS.h3}}>${sumOrder()}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: SIZES.padding * 3,
                            paddingVertical:  SIZES.padding * 2,
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <Image
                                source={icons.pin}
                                resizeMode='contain'
                                style={{
                                    height: 20,
                                    width:20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{marginLeft: SIZES.padding,...FONTS.h4}}>Location</Text>
                        </View>
                        <View
                            style={{ flexDirection: 'row' }}
                        >
                            <Image
                                source={icons.master_card}
                                resizeMode='contain'
                                style={{
                                    height: 20,
                                    width:20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{marginLeft: SIZES.padding,...FONTS.h4}}>888</Text>
                        </View>
                    </View>
                    <View
                        style={{ 
                            padding: SIZES.padding * 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("OrderDelivery", {
                                    restaurant,
                                    currentLocation
                                })
                                click()
                            }}
                        >
                            <LinearGradient 
                                colors={['#faa51a', '#f47a20']}
                                style={{
                                    width: SIZES.width * 0.9,
                                    padding: SIZES.padding,
                                    alignItems: 'center',
                                    borderRadius: 25
                                }}
                            >
                                <Text style={{color: COLORS.white,...FONTS.h2}}>Order</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                {isIphoneX() &&
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}
                    >
                    </View>
                }
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFoodInfo()}
            {renderOrder()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
});
