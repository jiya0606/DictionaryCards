import React from 'react';
import { Image, FlatList, Button, Platform, StyleSheet, AppButton, TouchableOpacity, TouchableHighlightStyleSheet, Text, View, Dimensions, Animated, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native';
import { render } from 'react-dom';
import { Audio } from 'expo-av'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
import Icon from 'react-native-vector-icons/Ionicons'
const vocabCards = [
   {
      image: require('/Users/jiya/test/assets/mango.jpg'),
      description: "Mangos are sweet fruits that are typically are a yellow color with a hint of red/ orange. They have a hard center and juicy, soft pulp. Mangos typically grow on talll trees in tropical areas.", 
      engText: "Mango",
      frenchText: "Mangue", 
      audio: require('/Users/jiya/test/assets/sound.m4a'),
    },
  
    {
      image: require('/Users/jiya/test/assets/watermelon.jpeg'),
      description: "Watermelons are amoung the biggest fruits and come in sphereical shapes. They have a dark green outer layer, black seeds, and are red on the inside. They are sweet, juicy, and great to eat during the summertime!",
      engText: "Watermelon",
      frenchText: "Pastèque",
      audio: require('/Users/jiya/test/assets/watermelon.m4a'),
    },
  
    {
      image: require('/Users/jiya/test/assets/baobabFruit.jpeg'),
      description: "Baobab Fruit is common in Africa. It is light green or grey on the outside, and its pulp divides into small white pieces. The fruit tastes dry and has a yogurt-like flavor.",
      engText: "Baobab Fruit",
      frenchText: "fruit du baobab",
      audio: require('/Users/jiya/test/assets/baobab fruit.m4a'),
    },
  
    {
      image: require('/Users/jiya/test/assets/madd.jpeg'),
      description: "Madd is a orange/brown fruit that contains a soft and juicy pulp. The fruit is sweet and tart. The fruits usually grow on wines and take more than a year to harvest",
      engText: "Madd",
      frenchText: "Fou",
      audio: require('/Users/jiya/test/assets/madd.m4a'),
    },
  
    {
      image: require('/Users/jiya/test/assets/ditax.jpeg'),
      description: "Ditax has a brown outer coating and a green pulp. It can have both a sweet and sour flavor and has a dry pulp. Ditax also has a seed in the middle of the fruit.",
      engText: "Ditax",
      frenchText: "Ditax", 
      audio: require('/Users/jiya/test/assets/ditax.m4a'),
    },
  
    {
      image: require('/Users/jiya/test/assets/coconut.jpeg'),
      description: "Coconuts have a brown outer coating and are white on the inside. They are filled with flavored water and are typically hard to break. Coconuts are also found on high trees.",
      engText: "Coconut",
      frenchText: "Noix de coco", 
      audio: require('/Users/jiya/test/assets/coconut.m4a'),
    },
  
    {image: require('/Users/jiya/test/assets/tomato.jpeg'),
      description: "Tomatoes are red on the outside and on the inside. They have a squishy, soft pulp, which is filled with seeds. Tomatoes taste juicy and sweet, but can taste sour if they are not ripe.",
      engText: "Tomato",
      frenchText: "Tomate",
      audio: require('/Users/jiya/test/assets/tomato.m4a'),
    },

  
]

export default class App extends React.Component {
  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
    this.sound = new Audio.Sound();
  }

  // audio
   // audio device adjustment 
    async componentDidMount() {
      Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
    }); 

    // doesn't play when app isn't on 
    this.status = {
      shouldPlay: false,
    };
    }

    // play file 
    playSound() {
      // audio file
      this.sound.loadAsync(vocabCards[this.state.currentIndex].audio, this.status, false);
      this.sound.replayAsync();
    }
  
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex - 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  renderVocabCards = () => {
    return vocabCards.map((item, i) => {
      console.log(i);
      if (this.state.currentIndex >= vocabCards.length) {this.state.currentIndex=0}
      if (this.state.currentIndex < 0) {this.state.currentIndex=vocabCards.length-1}
      
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
            </Animated.View>

            <View style = {styles.container}>
      <View style = {styles.dictionaryContainer}>
        <Text style = {styles.dictionaryText}>Dictionary</Text>
      </View>
  
      {/* Wolof audio */}
      <View style = {styles.wolofContainer}>
        <Button title="WOLOF" color="#000000" style = {styles.wolofText} onPress={this.playSound.bind(this)}></Button>
        <Ionicons name="ios-volume-high" size={24} color="black" style = {styles.volumePositioning} />
      </View>

      {/* image */}
      <View style = {styles.imgContainer}>
        <Image source={vocabCards[this.state.currentIndex].image} style ={styles.imageFormat} /> 
      </View> 
      
      {/* Description  */}
      <View style = {styles.descContainer}>
        <Text style = {styles.descFormat}>{vocabCards[this.state.currentIndex].description} </Text>
      </View>
      
      {/* word buttons */}

        {/* english button */}
        <View style = {styles.buttonContainer}>
        <TouchableOpacity
         style={styles.roundButton1}
          onPress={()=>{}}
          >
          <Text style = {styles.buttonText}>{vocabCards[this.state.currentIndex].engText}</Text>
        </TouchableOpacity>

        {/* french button */}
          <TouchableOpacity 
            style={styles.roundButton1}
            onPress={()=>{}}
            >
            <Text style = {styles.buttonText}>{vocabCards[this.state.currentIndex].frenchText}</Text>
          </TouchableOpacity>
    
        {/* slider buttons */}
        {/* <View style={{marginTop:"5%"}}>
        <TouchableOpacity onPress={()=>{
          console.log(this.state.currentIndex)
          this.state.currentIndex = this.state.currentIndex +1
        }}>
          <View>
            <AntDesign style = {styles.slideDesignRight} name="rightcircle" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <AntDesign style = {styles.slideDesignLeft} name="leftcircle" size={24} color="black" />
        </View> */}
      </View>
    </View>

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
              source={item.uri} />

          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>

        </View>
        <View style={{ flex: 1 }}>
          {this.renderVocabCards()}
        </View>
        <View style={{ height: 60 }}>

        </View>


      </View>

    );
  }
}


const styles = StyleSheet.create({
  //general container 
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    // dictionary
    dictionaryText: {
     fontWeight: 'bold',
      fontSize: 21,
    },

    dictionaryContainer: {
      alignItems: 'center',
      // paddingTop: "20%",
      width: "100%",
      height: "15%",
      borderColor: 'black',
     // borderWidth: 0, 
     paddingBottom: "4%",
      backgroundColor: "#d3d3d3",
      justifyContent: 'flex-end',
    },

    // WOLOF button
    wolofContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingTop: '8.5%', 
   },

    wolofText: {
     fontWeight: 'bold',
      fontSize: 30,
   },

   // volume icon 
   volumePositioning: {
    position: 'relative',
    top: "-50%",
    bottom: 0,
    left: "12%",
    right: 0,
   },
   
   // term description 
  descFormat: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Georgia',
    paddingHorizontal: 20,
  },

  descContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "95%",
  },
  
  //image 
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '25%',
    width: "90%",
    height: "37%",
  },
  
  imageFormat: {
    width: "90%",
    height: "125%",
    top: "-50%",
    // paddingTop: '55%',
  },

  // English and French buttons 
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "5%",
    height: "20%",
    width: "100%",
  },

  roundButton1: {
     justifyContent: 'center',
      alignItems: 'center',
      width: "90%",
      height: "30%",
      padding: 10,
      marginBottom: 10,
      borderRadius: 24,
      fontSize: 100,
      backgroundColor: '#FFE5B4',
  },

  // english and french text 
  buttonText: {
    fontSize: 17,
    fontFamily: 'Georgia',
  },

  // next & back icons 
  // slideDesignRight: {
  //   right: "-40%",
  //   bottom: "-30%",
  // },

  // slideDesignLeft: {
  //   left: "-40%",
  //   bottom: "14%",
  // },

  
});