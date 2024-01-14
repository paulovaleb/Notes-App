import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, useColorScheme, Appearance } from 'react-native';
import { setValueInFirestoreById, getDocumentById } from '../config/firebaseOperations';

const NoteScreen = ({ route }) => {
  const id = route.params;
  const [doc, setDoc] = useState({ name: '', value: '' });
  const [inputName, setInputName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const colorScheme = useColorScheme();
  const [manualMode, setManualMode] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const document = await getDocumentById('Notes', id);
        setDoc(document);
        setInputName(document.name);
        setInputValue(document.value);
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchDocument();
  }, [id]);

  useEffect(() => {
    const saveToFirestore = async () => {
      console.log(id, inputName, inputValue);
      await setValueInFirestoreById('Notes', id, inputName, inputValue);
    };

    // Delay saving to avoid rapid saving on every keystroke
    const saveDelay = setTimeout(() => {
      saveToFirestore();
    }, 1000); // Adjust the delay time as needed

    return () => clearTimeout(saveDelay); // Clear the timeout on component unmount or input change
  }, [id, inputName, inputValue]);

  const toggleColorScheme = () => {
    setManualMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const currentColorScheme = manualMode || colorScheme || Appearance.getColorScheme() || 'light';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColorScheme === 'dark' ? '#121212' : '#f0f0f0' },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentColorScheme === 'dark' ? '#333' : '#fff',
            color: currentColorScheme === 'dark' ? '#fff' : '#000',
            borderRadius: 10,
            marginTop: 0, // Adjusted to align with the top
          },
        ]}
        placeholder={doc.name}
        value={inputName}
        onChangeText={(text) => setInputName(text)}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentColorScheme === 'dark' ? '#333' : '#fff',
            color: currentColorScheme === 'dark' ? '#fff' : '#000',
            height: 120,
            borderRadius: 10,
          },
        ]}
        placeholder={doc.value}
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        multiline
      />
      <View style={styles.switchContainer}>
        <Switch
          value={manualMode === 'dark'}
          onValueChange={toggleColorScheme}
          trackColor={{ false: currentColorScheme === 'dark' ? '#555' : '#ddd', true: '#2ecc71' }}
          thumbColor={currentColorScheme === 'dark' ? '#fff' : '#fff'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: '100%',
  },
  switchContainer: {
    marginTop: 10,
  },
});

export default NoteScreen;
