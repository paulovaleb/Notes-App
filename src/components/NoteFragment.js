import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {getDocumentById } from '../config/firebaseOperations';


const NoteFragment = (props) => {
  const { id, name, value} = props;
  const navigation = useNavigation();

  const handlePress = () => {
    const documentRef = getDocumentById('Notes', id);
    console.log(documentRef)
    navigation.navigate('NoteScreen', { id, name, value });
  };

  return (
    <View>
      {console.log(props)}
      <Pressable onPress={handlePress}>
        <li key={id}>{name}</li>
      </Pressable>
    </View>
  );
};

export default NoteFragment;
