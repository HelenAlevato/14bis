import { Content } from 'carbon-components-react';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import './app.scss';
import MainHeader from './components/MainHeader';
import CodeListPage from './content/CodeListPage/CodeListPage';
import HomePage from './content/HomePage/HomePage';
import EditCodeListPage from './content/EditCodeListPage/EditCodeListPage'

class App extends Component {
  render() {
    return (
      <>
        <MainHeader></MainHeader>
        <Content>
          <div style={{marginLeft: "20%", marginRight: "20%"}}>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/CodeList/:nomeManual" component={CodeListPage} />
                <Route path="/EditCodeList/:nomeManual" component={EditCodeListPage} />
            </Switch>
          </div>
        </Content>
      </>
    );
  }
}

export default App;
