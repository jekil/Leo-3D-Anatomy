import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import LayoutEditor from '../../components/Layout/LayoutEditor';

export default function App() {

    return (
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Dashboard />
                    </Route>
                    <Route path="/editor/:id">
                        <LayoutEditor />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}