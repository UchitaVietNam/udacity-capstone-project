import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Icon, Menu, Segment } from 'semantic-ui-react'

import Auth from '../../auth/Auth'
import { EditTodo } from '../todo/EditTodo'
import { LogIn } from '../authen/LogIn'
import { NotFound } from '../error/NotFound'
import { Todos } from '../todo/Todos'
import ChatHomePage from '../chat'
import './App.css'
import UserInfo from '../user'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '../../store'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Segment style={{ padding: '1em 0em', height: '100%' }} vertical>
            <Grid
              container
              stackable
              style={{ height: '100%' }}
              verticalAlign="middle"
            >
              <Grid.Row style={{ height: '100%' }}>
                <Grid.Column width={16} style={{ height: '100%' }}>
                  <Router history={this.props.history}>
                    {this.generateMenu()}
                    <div className="home-page">
                      {this.generateCurrentPage()}
                    </div>
                  </Router>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </PersistGate>
      </Provider>
    )
  }

  generateMenu() {
    return (
      <Menu secondary>
        <Menu.Item name="home">
          <Icon name="home" size="large" />
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Item name="todos">
          <Icon name="sticky note outline" size="large" />
          <Link to="/todos">Todos</Link>
        </Menu.Item>

        <Menu.Item name="user">
          <Icon name="user" size="large" />
          <Link to="/user">User</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          <Icon name="power off" size="large" />
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <ChatHomePage {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos"
          exact
          render={(props) => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos/:todoId/edit"
          exact
          render={(props) => {
            return <EditTodo {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/user"
          exact
          render={(props) => {
            return <UserInfo {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
