import React, {Component} from "react"
import {withStyles} from "@material-ui/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import styles from "./styles/MiniPaletteStyles"

class MiniPalette extends Component{
    constructor(props){
        super(props);
        this.deletePalette = this.deletePalette.bind(this);
        this.handleLocalClick = this.handleLocalClick.bind(this);
        this.deletePalette = this.deletePalette.bind(this);
    }
    deletePalette(e){
        e.stopPropagation();
        this.props.openDialog(this.props.id);
    }
    handleLocalClick(){
        this.props.handleClick(this.props.id);
    }
    render(){
        const {classes, paletteName, emoji, colors} = this.props;
        const miniColorBoxes = colors.map(color => (
            <div className = {classes.miniColor} style = {{background: color.color}} key = {color.name}/>
        ));
        return (
            <div className = {classes.root} onClick = {this.handleLocalClick}>
                <DeleteIcon className = {classes.deleteIcon} style = {{transition: "all 0.3s ease-in-out"}} onClick = {this.deletePalette}/>
                <div className = {classes.colors}>{miniColorBoxes}</div>
                <h5 className = {classes.title}>{paletteName} <span className = {classes.emoji}>{emoji}</span></h5>
            </div>
        );
    }
}

export default withStyles(styles)(MiniPalette);