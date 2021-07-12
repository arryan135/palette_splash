import React, { PureComponent } from 'react'
import {Route, Switch} from "react-router-dom";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import Palette from "./Palette"
import PaletteList from "./PaletteList.js";
import SingleColorPalette from "./SingleColorPalette.js";
import NewPaletteForm from "./NewPaletteForm.js"
import Page from "./Page"
import {generatePalette} from "./colorHelpers.js"
import seedColors from "./seedColors.js"

class App extends PureComponent {
  constructor(props){
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = {palettes: savedPalettes || seedColors}
    this.savePalette = this.savePalette.bind(this);
    this.findPalette = this.findPalette.bind(this);
    this.deletePalette = this.deletePalette.bind(this);
  }
  findPalette(id){
    return this.state.palettes.find(palette => palette.id === id);
  }
  savePalette(newPalette){
    this.setState(curState => (
      {palettes: [...curState.palettes, newPalette]}
    ), () => {
      this.syncLocalStorage();
    });
    
  }
  deletePalette(id){
    this.setState(
      curState => ({palettes: curState.palettes.filter(palette => palette.id !== id)}), 
      this.syncLocalStorage
    );
  }
  syncLocalStorage(){
    window.localStorage.setItem("palettes", JSON.stringify(this.state.palettes));
  }
  render() {
    return (
      <Route render = {({location}) => (
        <TransitionGroup>
          <CSSTransition key = {location.key} classNames = "page" timeout = {500}>
            <Switch location = {location}>
            <Route exact path = "/palette/new" render = {(routeProps) => <Page><NewPaletteForm savePalette = {this.savePalette} {...routeProps} palettes = {this.state.palettes} /> </Page>} />
            <Route exact path = "/" render = {routeProps => <Page><PaletteList palettes = {this.state.palettes} {...routeProps} deletePalette = {this.deletePalette}/></Page>}/>
            <Route 
              exact 
              path = "/palette/:id" 
              render = {routeProps => 
                <Page><Palette palette = {generatePalette(this.findPalette(routeProps.match.params.id))} /></Page>
              } 
            />
            <Route exact path = "/palette/:paletteId/:colorId" render = {routeProps => (
              <Page>
                <SingleColorPalette 
                  palette = {generatePalette(this.findPalette(routeProps.match.params.paletteId))}
                  colorId = {routeProps.match.params.colorId}
                />
              </Page>
            )}/>
            <Route render = {routeProps => <Page><PaletteList palettes = {this.state.palettes} {...routeProps} deletePalette = {this.deletePalette}/></Page>}/>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      )}/>
    )
  }
}

export default App;
