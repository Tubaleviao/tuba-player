import React, { memo } from 'react';
import { TouchableHighlight, StyleSheet, Text } from 'react-native';

const SongItem = ( props ) => {
    const {play, song} = props
        return (
            <TouchableHighlight onPress={ () => play( song.id ) } >
                <Text style={ styles.item }>{ song.name }</Text>
            </TouchableHighlight>
        );
    };
    
 export default memo(SongItem);

 const styles = StyleSheet.create({
	item: {
		color: '#00ff00',
		backgroundColor: '#002200',
		padding: 16,
		marginVertical: 4,
		marginHorizontal: 16,
		textAlign: "center",
	}
});