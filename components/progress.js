import React from 'react'
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'
import tp, { useProgress } from 'react-native-track-player'

const Progress = (props) => {
    const { position, duration } = useProgress()
    const { sliding, setSliding } = props // sliding, setSliding

    return (
        <View>
            <Slider onValueChange={() => !sliding ? setSliding(true) : true}
                onSlidingComplete={v => tp.seekTo(v * duration)}
                value={position / duration || 0} />
        </View>
    );
}
export default Progress
