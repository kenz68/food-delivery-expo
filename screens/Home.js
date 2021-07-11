import React from 'react';
import {
    SafeAreaView, 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Vibration,
    Platform,
    AsyncStorage
} from 'react-native';

import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { icons, images, sounds, SIZES, COLORS, FONTS, LG } from '../constants';

export default function Home({ navigation }) {

    const [sound, setSound] = React.useState();
    const [lg, setLang] = React.useState(LG.en);

    async function click() {
        const { sound } = await Audio.Sound.createAsync(sounds.click);

        setSound(sound);
        await sound.playAsync();
        Vibration.vibrate();
    }

    const currentLg = async () => {
        const item = await AsyncStorage.getItem('lang');
        console.log(item)
        setLang(item || LG.en);
    };

    React.useEffect(() => {
        currentLg();
        return sound
              ? () => {sound.unloadAsync(); }
              : undefined;
    }, [sound]);


    //dump data
    const initialCurrentLocation = {
        streetName: "Kuching",
        gps: {
            latitude: 10.726954,
            longitude: 106.670299
        }
    }

    const categoryData = [
        {
            id: 1,
            name: 'Rice',
            icon: icons.rice_bowl,
        },
        {
            id: 2,
            name: 'Noodles',
            icon: icons.noodle,
        },
        {
            id: 3,
            name: 'Hot dogs',
            icon: icons.hotdog,
        },
        {
            id: 4,
            name: 'Salads',
            icon: icons.salad,
        },
        {
            id: 5,
            name: 'Burgers',
            icon: icons.hamburger,
        },
        {
            id: 6,
            name: 'Pizza',
            icon: icons.pizza,
        },
        {
            id: 7,
            name: 'Snacks',
            icon: icons.fries,
        },
        {
            id: 8,
            name: 'Sushi',
            icon: icons.sushi,
        },
        {
            id: 9,
            name: 'Desserts',
            icon: icons.donut,
        },
        {
            id: 10,
            name: 'Drinks',
            icon: icons.drink,
        }
    ];

    //price rating
    const affordable = 1;
    const fairPrice = 2;
    const expensive = 3;

    const restaurantData = [
        {
            id: 1,
            name: "Crispy Chicken burger",
            rating: 4.8,
            categories: [5, 7],
            priceRating: affordable,
            photo: images.burger_restaurant_1,
            duration: '30 - 45 min',
            location: {
                latitude: 10.671139,
                longitude: 106.637667
            },
            courier: {
                avatar: images.avatar_1,
                name: 'Amy'
            },
            menu: [
                {
                    menuId: 1,
                    name: "Crispy chicken burger 1",
                    photo: images.crispy_chicken_burger,
                    calories: 200,
                    price: 10
                },
                {
                    menuId: 2,
                    name: "Chicken burger with Honey Mustard",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Crispy chicken burger with Honey Mustard Coleslaw",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 3,
                    name: "Crispy Baked French Fries",
                    photo: images.baked_fries,
                    description: "Crispy Baked French Fries",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 4,
                    name: "Crispy chicken burger",
                    photo: images.crispy_chicken_burger,
                    calories: 200,
                    price: 10
                },
                {
                    menuId: 5,
                    name: "Chicken burger with Honey Mustard",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Crispy chicken burger with Honey Mustard Coleslaw",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 6,
                    name: "Crispy Baked French Fries",
                    photo: images.baked_fries,
                    description: "Crispy Baked French Fries",
                    calories: 194,
                    price: 8
                }
            ]
        },
        {
            id: 2,
            name: "Crispy Baked French Fries 2",
            rating: 4.8,
            categories: [1, 7],
            priceRating: affordable,
            photo: images.burger_restaurant_2,
            duration: '30 - 45 min',
            location: {
                latitude: 10.712718,
                longitude: 106.656892
            },
            courier: {
                avatar: images.avatar_1,
                name: 'Amy'
            },
            menu: [
                {
                    menuId: 1,
                    name: "Crispy chicken burger",
                    photo: images.crispy_chicken_burger,
                    calories: 200,
                    price: 10
                },
                {
                    menuId: 2,
                    name: "Chicken burger with Honey Mustard",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Crispy chicken burger with Honey Mustard Coleslaw",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 3,
                    name: "Crispy Baked French Fries",
                    photo: images.baked_fries,
                    description: "Crispy Baked French Fries",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 41,
                    name: "Crispy chicken burger",
                    photo: images.crispy_chicken_burger,
                    calories: 200,
                    price: 10
                },
                {
                    menuId: 5,
                    name: "Chicken burger with Honey Mustard",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Crispy chicken burger with Honey Mustard Coleslaw",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 6,
                    name: "Crispy Baked French Fries",
                    photo: images.baked_fries,
                    description: "Crispy Baked French Fries",
                    calories: 194,
                    price: 8
                }
            ]
        }
    ];

    const [categories, setCategories] = React.useState(categoryData);
    const [selectedCategories, setSelectedCategories] = React.useState(categories[0]);
    const [restaurants, setRestaurants] = React.useState(restaurantData);
    const [currentLocation, setCurrentLocation] = React.useState(initialCurrentLocation);

    function onSelectCategory(category) {
        let restaurantList = restaurantData.filter(a => a.categories.includes(category.id));

        setRestaurants(restaurantList);
        setSelectedCategories(category);

        click(); 
    }

    function renderHeader() {
        return (
            <View style={{flexDirection: 'row', height: 50}}>
               <TouchableOpacity
                    style={{
                        width:50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image 
                        source={icons.nearby}
                        resizeMode='contain'
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        width: '70%', 
                        height: '100%',
                        backgroundColor: COLORS.lightGray3,
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: SIZES.radius
                    }}
                    >
                        <Text style={{...FONTS.h3}}>{currentLocation.streetName}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        width:50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image 
                        source={icons.basket}
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

    function renderCategory() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <LinearGradient 
                        colors={(selectedCategories?.id == item.id) ? ['#faa51a', '#f47a20'] : ['#FFFFFF', '#ededed']}
                        style={{
                            padding: SIZES.padding,
                            paddingBottom: SIZES.padding * 2,
                            borderRadius: SIZES.radius,
                            borderBottomRadius: SIZES.radius * 2,
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: SIZES.padding,
                        }}
                    >
                    <View 
                        style={{
                            width: 50, 
                            height: 50,
                            borderRadius: 25,
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: (selectedCategories?.id == item.id) ? COLORS.white : COLORS.lightGray,
                            ...styles.shadow
                        }}
                    >
                        <Image 
                            source={item.icon}
                            resizeMode='contain'
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            marginTop: SIZES.padding, 
                            color: (selectedCategories?.id == item.id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                            
                        }}
                    >
                        {item.name}
                    </Text>
                    </LinearGradient>
                </TouchableOpacity>
            )
        };

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{...FONTS.h1}}>Main</Text>
                <Text style={{...FONTS.h1}}>Categories</Text>

                <FlatList
                    data={categories}
                    horizontal
                    showHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                >
                </FlatList>
            </View>
        );
    }

    function renderRestaurentList() {

        function getCategoryNameById(id) {
            let category = categories.filter(i => i.id == id);

            if (category.length) {
                return `${category[0].name} \u00B7 `;
            }

            return '';
        }

        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{marginBottom: SIZES.padding * 2}}
                    onPress={() => {
                        navigation.navigate("Restaurant", {
                            item,
                            currentLocation
                        })
                        click();
                    }}
                >

                    <View
                    >
                        <Image 
                            source={item.photo}
                            resizeMode='cover'
                            style={{
                                width: '100%',
                                height: Platform.isPad ? 400 : 200,
                                borderRadius: SIZES.radius,
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 50,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            ...styles.shadow 
                        }}
                        >
                            <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
                        </View>
                    </View>
                    <Text style={{marginTop: SIZES.padding,...FONTS.body2}}>{item.name}</Text>
                    <View
                        style={{
                            marginTop: SIZES.padding/2,
                            flexDirection: 'row'
                        }}
                    >
                        <Image
                            source={icons.star}
                            style={{
                                height: 20,
                                width:20,
                                tintColor: COLORS.primary,
                                marginRight: 10
                            }}
                        />
                        <Text style={{...FONTS.body3}}>{item.rating}</Text>
                        <View 
                            style={{
                                flexDirection: 'row',
                                marginLeft: 10
                            }}
                        >
                           { item.categories.map((categoryId) => {
                                return ( 
                                    <View
                                        style={{ flexDirection: 'row' }}
                                        key={categoryId}
                                    >
                                        <Text
                                            style={{ ...FONTS.body3 }}
                                        >
                                            {getCategoryNameById(categoryId)}
                                        </Text>
                                    </View>
                                )
                           }) } 
                           { [1,2,3].map((priceRating) => {
                                return (
                                    <Text
                                        key={priceRating}
                                        style={{
                                            ...FONTS.body3,
                                            color: (priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray,
                                        }}
                                    >$</Text>
                                )
                           }) }
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
             <FlatList
                    data={restaurants}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ 
                        paddingHorizontal: SIZES.padding * 2,
                        paddingBottom: 30
                    }}
                >
                </FlatList>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderCategory()}
            {renderRestaurentList()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4,
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
