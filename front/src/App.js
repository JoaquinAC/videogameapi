import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FormPage from './components/FormPage';
import DetailPage from './components/DetailPage';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/detail/:id" component={DetailPage} />
        <Route exact path="/create" component={FormPage} />
    </Switch>
  );
};

export default App;