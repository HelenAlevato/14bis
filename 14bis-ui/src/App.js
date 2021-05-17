import { Content } from 'carbon-components-react';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import './app.scss';
import MainHeader from './components/MainHeader';
import CodeListPage from './content/CodeListPage/CodeListPage';
import HomePage from './content/HomePage/HomePage';

class App extends Component {
  render() {
    return (
      <>
        <MainHeader></MainHeader>
        <Content>
          <div style={{marginLeft: "20%", marginRight: "20%"}}>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/CodeList" component={CodeListPage} />
            </Switch>
          </div>
        </Content>
      </>
    );
  }
}

export default App;
