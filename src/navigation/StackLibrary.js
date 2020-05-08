import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation';

// screens
import LibraryScreen from '../screens/Library';
import YourBooksScreen from '../screens/CategoricalBookList'

// icons
import SvgTabLibrary from '../components/icons/Svg.TabLibrary';

const Icon = ({ focused }) => <SvgTabLibrary active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    LibraryMain: {
      //screen: LibraryScreen
      screen: YourBooksScreen
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: 'Library',
      tabBarIcon: Icon
    }
  }
);
