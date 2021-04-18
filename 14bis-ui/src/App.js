import { Button, Content } from 'carbon-components-react';
import React, { Component } from 'react';
import MainHeader from './components/MainHeader'
import './app.scss';

class App extends Component {
  render() {
    return (
      <>
        <MainHeader></MainHeader>
        <Content>
          <Button>Hello World</Button>
        </Content>
      </>
    );
  }
}

export default App;
