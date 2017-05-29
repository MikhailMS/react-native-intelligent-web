// Import components and packages
import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ListView,
  FlatList,
  ScrollView,
  View
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
var ScrollableTabView = require('react-native-scrollable-tab-view');
var ProgressBar = require('ProgressBarAndroid');
var DefaultTabBar = require('./DefaultTabBar');

// Initialize constants and variables
const host_name = 'http://9622b846.ngrok.io';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontSize: 12,
    textAlign: 'center',
  },
  tweetsListView: {
    paddingTop: 18,
    backgroundColor: '#F5FCFF',
  },
  realTweetsListView: {
    paddingTop: 18,
    backgroundColor: '#F5FCFF',
  },
  photo: {
    paddingTop: 2,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  separator: {
    flex: 1,
    paddingTop: 2,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
});
let tweetSearch = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let realtimeSearch = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let dbSearch = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let realTweetsStore = [];

// Main Component
export default class firstTry extends Component {

  constructor(props) {
    super(props);
    this.state = {query: '', isReceived: false, tweets: tweetSearch, isStreamOn: false, realtimeTweets: realtimeSearch, dbTweets: dbSearch};
  }

  componentDidMount() {
    // Setup socket channel
    this.socket = SocketIOClient(host_name);
  }

  componentDidUpdate() {
    /*if("listHeight" in this.state &&
           "footerY" in this.state &&
               this.state.footerY > this.state.listHeight)
    {
        var scrollDistance = this.state.listHeight - this.state.footerY;
        this.refs.list.getScrollResponder().scrollTo({y: -scrollDistance, animated: true});
    }*/
  }

  componentWillUnmount() {
    // Disconnect socket once app is destroyed
    this.socket.disconnect();
  }

  /* Helper render functions */
  renderTwitterSearch() {
    return (
      <View
        tabLabel='Search Twitter'
        style={{padding: 10}}
      >
        <TextInput
          style={{height: 40}}
          placeholder="Type search query..."
          onChangeText={(txt) => this.setState({query: txt})}
        />
        <Button
          onPress={() => this.handleSearchClick()}
          style={styles.buttonStyle}
          title='Submit query'
        />
      {this.state.isReceived && <ScrollView style={{height: 520}}>
                                  <ListView
                                      style={styles.tweetsListView}
                                      dataSource={this.state.tweets}
                                      renderRow={(rowData) => {
                                                                return (
                                                                  <ScrollView>
                                                                    <View style={styles.container}>
                                                                      <Image source={{uri: rowData.avatar_url}} style={styles.photo}/>
                                                                      <Text style={styles.title}>{rowData.author_name}</Text>
                                                                    </View>
                                                                    <View>
                                                                      <Text style={styles.text}>{rowData.text}</Text>
                                                                      <Text style={styles.date}>{`${rowData.date_time.week_day}, ${rowData.date_time.date}/${rowData.date_time.month}/${rowData.date_time.year} ${rowData.date_time.time} GTM`}</Text>
                                                                      <Text style={styles.link}>{rowData.tweet_url}</Text>
                                                                    </View>
                                                                  </ScrollView>
                                                                );
                                                }
                                      }
                                      renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                                  />
                                </ScrollView>
        }
      </View>
    );
  }

  renderRealtimeSearch() {
    return (
      <View
        tabLabel='Realtime Search'
        style={{padding: 10}}
        >
        <TextInput
          style={{height: 40}}
          placeholder="Type search query..."
          onChangeText={(txt) => this.setState({query: txt})}
        />
        <Button
          onPress={() => this.handleStreamClick()}
          style={styles.buttonStyle}
          title='Submit query'
        />
      {this.state.isStreamOn && <ScrollView style={{height: 520}}>
                                  <ListView
                                      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                                      style={styles.realTweetsListView}
                                      dataSource={this.state.realtimeTweets}
                                      renderRow={(rowData) => {
                                                                return (
                                                                  <ScrollView>
                                                                    <View style={styles.container}>
                                                                      <Image source={{uri: rowData.avatar_url}} style={styles.photo}/>
                                                                      <Text style={styles.title}>{rowData.author_name}</Text>
                                                                    </View>
                                                                    <View>
                                                                      <Text style={styles.text}>{rowData.text}</Text>
                                                                      <Text style={styles.date}>{`${rowData.date_time.week_day}, ${rowData.date_time.date}/${rowData.date_time.month}/${rowData.date_time.year} ${rowData.date_time.time} GTM`}</Text>
                                                                      <Text style={styles.link}>{rowData.tweet_url}</Text>
                                                                    </View>
                                                                  </ScrollView>
                                                                );
                                                }
                                      }
                                      renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                                  />
                                </ScrollView>
        }
      </View>
    );
  }

  renderDBSearch() {
    return (
      <View tabLabel='Search Database'style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type search query..."
          onChangeText={(txt) => this.setState({query: txt})}
        />
        <Button
          onPress={() => this.handleDBClick()}
          style={styles.buttonStyle}
          title='Submit query'
        />
      {this.state.dbTweets && <ListView
                                      style={styles.listView}
                                      dataSource={this.state.dbTweets}
                                      renderRow={(rowData) => <View>
                                                                <View style={styles.container}>
                                                                  <Image source={{uri: rowData.avatar_url}} style={styles.photo}/>
                                                                  <Text style={styles.title}>{rowData.author_name}</Text>
                                                                </View>
                                                                <View>
                                                                  <Text style={styles.text}>{rowData.text}</Text>
                                                                  <Text style={styles.date}>{`${rowData.date_time.week_day}, ${rowData.date_time.date}/${rowData.date_time.month}/${rowData.date_time.year} ${rowData.date_time.time} GTM`}</Text>
                                                                  <Text style={styles.link}>{rowData.tweet_url}</Text>
                                                                </View>
                                                              </View>
                                                }
                                      renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                                  />
        }
      </View>
    );
  }

  /* Handle button clicks */
  handleSearchClick() {
    Alert.alert('Info', this.state.query);
    this.socket.emit('static-search', {query: this.state.query, db_only:false});
    if (!(this.socket.hasListeners('feed-search-result'))) {
      this.socket.on('feed-search-result', (error, data) => {
        if (data!=null) {
          this.setState({isReceived: true, tweets: tweetSearch.cloneWithRows(data.tweets)});
          Alert.alert('Info', 'Data is received');
        }
      })
    }
  }

  handleStreamClick() {
    Alert.alert('Info', this.state.query);
    this.socket.emit('open-stream', this.state.query);
    this.socket.on('stream-result', (error, data) => {
      if (data!=null) {
        if (realTweetsStore.length >=20) {
          realTweetsStore = [];
        }
        realTweetsStore.push(data);
        this.setState({isStreamOn: true, realtimeTweets: realtimeSearch.cloneWithRows(realTweetsStore)});
        //this.setState({isStreamOn: true, realtimeTweets: realTweetsStore});
        console.log('Info', 'Data is received');
      }
    })
  }

  handleDBClick() {
    return null;
  }

  /* Main render function */
  render() {
    return (
      <ScrollableTabView
        renderTabBar={() => <DefaultTabBar />}
        ref={(tabView) => { this.tabView = tabView; }}
      >
        {this.renderTwitterSearch()}
        {this.renderRealtimeSearch()}
        {this.renderDBSearch()}

      </ScrollableTabView>
    );
  }
}

// Register main component
AppRegistry.registerComponent('firstTry', () => firstTry);
