import React from 'react'
import { View } from 'react-native'
import Slider from '@react-native-community/slider'
import tp from 'react-native-track-player'

class Progress extends tp.ProgressComponent {

    render() {
        const {s, ss} = this.props
        return (
            <View>
                <Slider onValueChange={() => !s ? ss(true) : true}
						onSlidingComplete={v => tp.seekTo(v*this.state.duration)} 
						value={this.getProgress()} />
            </View>
        );
    }   
}
export default Progress
