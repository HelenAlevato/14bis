import { Content } from 'carbon-components-react';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import './app.scss';
import MainHeader from './components/MainHeader';
import HomePage from './content/HomePage/HomePage';

class App extends Component {
  render() {
    return (
      <>
        <MainHeader></MainHeader>
        <Content>
        <Switch>
            <Route exact path="/" component={HomePage} />
        </Switch>
        </Content>
      </>
    );
  }
}

export default App;
