import {ThemeProvider} from 'styled-components';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import Container from "./Container";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Stats from "./pages/Stats";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Connect from "./pages/Connect";
import {Provider} from "react-redux";
import store from './store';
import ProfileCollections from "./pages/ProfileCollections";
import CollectionCreate from "./pages/CollectionCreate";
import CollectionImport from "./pages/CollectionImport";
import Created from "./pages/Created";
import Community from "./pages/Community";
import AlertTemplate from "./components/Alert/AlertTemplate";
import {Provider as AlertProvider} from 'react-alert'
import CollectionModify from "./pages/CollectionModify";

function App() {
  return (
    <ThemeProvider theme={{}}>
      <Provider store={store}>
        <AlertProvider template={AlertTemplate}>
          <BrowserRouter>
            <Container>
              <Switch>
                <Route exact path={"/"}>
                  <Redirect to={"/home"}/>
                </Route>
                <Route exact path={"/home"} component={Home}/>
                <Route exact path={"/marketplace"} component={Marketplace}/>
                <Route exact path={"/marketplace/collection/:contract"} component={Collection}/>
                <Route exact path={"/marketplace/item/:contract/:tokenId"} component={Detail}/>
                <Route exact path={"/stats"} component={Stats}/>
                <Route exact path={"/connect"} component={Connect}/>
                <Route exact path={"/create"} component={Create}/>
                <Route exact path={"/create/:createType"} component={Create}/>
                <Route exact path={"/created"} component={Created}/>
                <Route exact path={"/cart"} component={Cart}/>
                <Route exact path={"/profile"} component={Profile}/>
                <Route exact path={"/profile/settings"} component={ProfileSettings}/>
                <Route exact path={"/profile/collections"} component={ProfileCollections}/>
                <Route exact path={"/profile/collections/create"} component={CollectionCreate}/>
                <Route exact path={"/profile/collections/modify/:id"} component={CollectionModify}/>
                <Route exact path={"/profile/import"} component={CollectionImport}/>
                <Route exact path={"/profile/:address"} component={Profile}/>
                <Route exact path={"/community"} component={Community}/>
                <Redirect to={"/"}/>
              </Switch>
            </Container>
          </BrowserRouter>
        </AlertProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
