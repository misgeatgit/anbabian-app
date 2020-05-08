// From search screen when user clicks on one category, this screen should be displayed
// to show list of books.

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AlbumsHorizontal from '../components/AlbumsHorizontal';
import YourBooksAM from '../mockdata/YourBooksAM.json';
import ScreenHeader from '../components/ScreenHeader';
import { gStyle } from '../constants';

const CategoricalBookList = () => (
  <View style={gStyle.container}>
    <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
      <ScreenHeader title="You books" />
    </View>
    <FlatList
      contentContainerStyle={styles.containerContent}
      data={YourBooksAM}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <AlbumsHorizontal data={item.books} heading={item.title} />
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerContent: {
    paddingLeft: 16
  }
});

export default CategoricalBookList;
