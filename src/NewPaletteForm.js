import React, { Component } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import PaletteFormNav from "./PaletteFormNav";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import DraggableColorList from "./DraggableColorList";
import ColorPickerForm from "./ColorPickerForm";
import styles from "./styles/NewPaletteFormStyles";
import seedColors from "./seedColors.js"
const arrayMove = require('array-move');


class NewPaletteForm extends Component {
    static defaultProps = {
        maxColors: 20
    };
    constructor(props){
        super(props);
        this.state = {
            open: true,
            currentColor : "teal",
            colors: seedColors[0].colors
        }
        this.addNewColor = this.addNewColor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeColor = this.removeColor.bind(this);
        this.clearColors = this.clearColors.bind(this);
        this.addRandomColor = this.addRandomColor.bind(this);
    }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  clearColors(){
      this.setState(curState => ({colors: []}));
  }

  addRandomColor(){
      const allColors = this.props.palettes.map(palette => palette.colors).flat();
      let rand = 0;
      let randColor = allColors[0];
      let isDuplicateColor = true;
      while (isDuplicateColor){
        rand = Math.floor(Math.random() * allColors.length);
        randColor = allColors[rand];
        let copyRandColor = randColor;
        isDuplicateColor = this.state.colors.some(color => color.name === copyRandColor.name);
      }
      this.setState(curState => ({
          colors: [...curState.colors, randColor] 
      }));
  }

  handleDrawerClose = () => {
    this.setState({ open: false });
  };


  onSortEnd = ({oldIndex, newIndex}) => {
      this.setState(({colors}) => ({
          colors: arrayMove(colors, oldIndex, newIndex)
      }));
  }

  addNewColor(newColor){
        
      this.setState(curState => (
          {colors: [...curState.colors, newColor], newColorName : ""}
      ));
  }

  handleChange(evt){
    this.setState({[evt.target.name]: evt.target.value});
  }

 handleSubmit(newPalette){
     newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, "-");
     newPalette.colors = this.state.colors;
      this.props.savePalette(newPalette);
      this.props.history.push("/");
  }

  removeColor(colorName){
      this.setState(curState => (
          {colors: curState.colors.filter(color => color.name !== colorName)}
      ));
  }

  render() {
    const { classes, maxColors, palettes} = this.props;
    const { open, colors } = this.state;
    const paletteIsFull = colors.length >= maxColors;

    return (
      <div className={classes.root}>
        <PaletteFormNav 
            open = {open} 
            palettes = {palettes} 
            handleSubmit = {this.handleSubmit} 
            handleDrawerOpen = {this.handleDrawerOpen}
        />
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className = {classes.container}>
            <Typography variant='h4' gutterBottom>Design Your Palette</Typography>
            <div className = {classes.buttons}>
                <Button variant='contained' color='secondary' onClick = {this.clearColors} className = {classes.button}>
                Clear Palette
                </Button>
                <Button variant='contained' color='primary' onClick = {this.addRandomColor} disabled = {paletteIsFull} className = {classes.button}>
                Random Color
                </Button>
            </div>
            <ColorPickerForm paletteisFull = {paletteIsFull} addNewColor = {this.addNewColor} colors = {colors}/>
          </div>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList 
            colors = {colors} 
            removeColor = {this.removeColor} 
            onSortEnd = {this.onSortEnd} 
            axis = "xy"
            distance = {20}
         />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);
