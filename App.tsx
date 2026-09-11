import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';


export default function App() {
  type Meal = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  };
  const [keyword, setKeyword] = useState('');
  const [mealList, setMealList] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);


  // Fetch recipes from url based on keyword
  const handleFetch = async () => {
    // Check if keyword is empty
    if (keyword == '') {
      alert('Please enter an ingredient');
      return;
    } else {
      setLoading(true);
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${keyword}`)
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        
        // Check if data is null
        if (data.meals === null) {
          alert('No recipes found for this ingredient');
          setMealList([]);
          setLoading(false);
          setKeyword('');
          return;
        }

        //add recipes to list
        setMealList(data.meals);
        console.log(mealList)
      } catch (error) {
        console.error(error);
      }
      setKeyword('');
      setLoading(false);
    }

    

  }
  return (
    <View style={styles.container}>
      <TextInput placeholder="Enter ingredient"
        value={keyword}
        onChangeText={text => setKeyword(text)}
        style={styles.input}
      />
      <Button title="Find" onPress={handleFetch} />
      {
        loading ?
          <ActivityIndicator size="large" color="#0000ff" />
          :
          <FlatList
            ItemSeparatorComponent={<View style={styles.separator} />}
            data={mealList}
            renderItem={({ item }) => (
              <View style={styles.list}>
                <Text>{item.strMeal}</Text>
                <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              </View>
            )}
          />
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 75,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 150,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 150,
  },

  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#0f0f0f",

  },
  list:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  }
});
