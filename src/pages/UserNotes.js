import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Switch, useColorScheme, Appearance } from 'react-native';
import { addValueInFirestore, getAllDocuments } from '../config/firebaseOperations';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [manualMode, setManualMode] = useState(null);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getAllDocuments('Notes');
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []); // Fetch notes initially

  useFocusEffect(
    React.useCallback(() => {
      fetchNotes();
    }, [])
  );

  const handleButtonClick = async () => {
    const id = await addValueInFirestore('Notes', 1, '', '');
    navigation.navigate('NoteScreen', id);
  };

  const handleNotePress = (id) => {
    navigation.navigate('NoteScreen', id);
  };

  const toggleColorScheme = () => {
    setManualMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // If manual mode is set, use it; otherwise, use system preference
  const currentColorScheme = manualMode || colorScheme || Appearance.getColorScheme() || 'light';

  return (
    <View style={[styles.container, { backgroundColor: currentColorScheme === 'dark' ? '#121212' : '#f0f0f0' }]}>
      {notes.map((note) => (
        <Pressable
          key={note.id}
          onPress={() => handleNotePress(note.id)}
          style={({ pressed }) => [
            styles.noteContainer,
            {
              backgroundColor: pressed
                ? currentColorScheme === 'dark'
                  ? '#444'
                  : '#ddd'
                : currentColorScheme === 'dark'
                ? '#121212'
                : '#fff',
            },
          ]}
        >
          <Text
            style={[
              styles.noteText,
              { color: currentColorScheme === 'dark' ? '#fff' : '#000' },
            ]}
          >
            {note.name}
          </Text>
        </Pressable>
      ))}
      
      <Pressable
        onPress={handleButtonClick}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? currentColorScheme === 'dark'
                ? '#2ecc71'
                : '#4CAF50'
              : currentColorScheme === 'dark'
              ? '#121212'
              : '#2ecc71',
            borderColor: currentColorScheme === 'dark' ? '#fff' : '#2ecc71', // White border in dark mode
            position: 'absolute',
            bottom: 20,
            right: 20,
          },
        ]}
      >
        <Icon name="add" size={24} color="#fff" />
      </Pressable>
    
      <View style={styles.toggleSwitchContainer}>
        <Switch
          value={manualMode === 'dark'}
          onValueChange={toggleColorScheme}
          trackColor={{ false: '#3498db', true: '#3498db' }}
          thumbColor={manualMode === 'dark' ? '#fff' : '#fff'}
        />
        <Text style={styles.toggleSwitchLabel}>
          Toggle {manualMode ? 'System Mode' : 'Manual Mode'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
  },
  noteText: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  toggleSwitchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitchLabel: {
    marginLeft: 10,
    color: '#fff',
  },
});
