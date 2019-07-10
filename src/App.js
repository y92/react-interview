import React, { Component } from 'react';
import './App.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Line } from 'rc-progress'
import { confirmAlert } from 'react-confirm-alert'; // Import
// import { Multiselect } from 'react-widgets'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as movies from './movies.js'

library.add(faThumbsUp, faThumbsDown, faTimesCircle);



class App extends Component{
  constructor(props) {
    super(props);
    this.movies = movies.movies$;
    this.test = "tutu"
    this.state = { 
      moviesArray : [], 
      categories : []
    }
  }

  checkCategories() {
    var categories = this.state.categories
    this.state.moviesArray.map((item, index) => {
      if (!categories.includes(item.category)) {
        categories.push(item.category)
      }
    })
    this.setState({ categories : categories.sort()})
  }

  componentDidMount() {
    console.log("OK")
    this.movies.then(
      value => {
        value.map((item, index) => {
          item.opinion = 0
        })
        console.log(value);
        this.setState({moviesArray : value })
        this.checkCategories()
      }
    )
  }

  render() {
    return (
      <div className="App">
        <h1>Movies</h1>
        {/*
          <Multiselect
            data={this.state.categories}
            default={this.state.categories}
            caseSensitive={false}
            filter="startsWith"
          />
        */}
        <div className="FilmList">
            { this.state.moviesArray.map((item, index) => {
              return (
                <div className="Film" key={ item.id }>
                  <div className="RemoveIcon">
                    <FontAwesomeIcon 
                      icon="times-circle" 
                      onClick={ () => {
                        confirmAlert({
                          customUI : ({ onClose }) => {
                            return (
                              <div className="AlertConfirm">
                                <h1 className="ConfirmTitle">Confirmation</h1>
                                <div className="ConfirmText">Voulez-vous vraiment supprimer <i>{item.title}</i> de la liste ?</div>
                                <div className="ConfirmButtons">
                                  <Button
                                    onClick= {
                                      () => {
                                        this.state.moviesArray.splice(index, 1);
                                        this.setState({ moviesArray : this.state.moviesArray })
                                        this.checkCategories()
                                        onClose();
                                      }
                                    }>Oui</Button>
                                  <Button
                                    onClick= {
                                      () => {
                                        onClose();
                                      }
                                    }>Non</Button>
                                </div>
                              </div>

                            )
                          },
                        })
                      }
                    }/>
                  </div>
                  <div className="Title">{item.title}</div>
                  <div className="Category">{item.category}</div>
                  { (item.likes + item.dislikes > 0) 
                  ? <Line strokeWidth={2} trailWidth={2} strokeLinecap="butt" strokeColor="#339933" trailColor="#ff3333" percent={100*item.likes/(item.likes+item.dislikes)}/>
                  : <Line strokeWidth={2} trailWidth={2} strokeLinecap="butt" strokeColor="#777777" trailColor="#777777" percent={0}/>
                  }

                  <div className="Likes" onClick={ () => {
                    if (item.opinion > 0) {
                      item.opinion = 0;
                      item.likes--;
                    }
                    else {
                      if (item.opinion < 0) {
                        item.dislikes--;
                      }
                      item.opinion = 1;
                      item.likes++;
                    }
                    this.setState({ moviesArray : this.state.moviesArray })
                  }}>
                    <FontAwesomeIcon icon="thumbs-up"/> {item.likes}
                  </div>
                  <div className="Dislikes" onClick={ () => {
                    if (item.opinion < 0) {
                      item.opinion = 0;
                      item.dislikes--;
                    }
                    else {
                      if (item.opinion > 0) {
                        item.likes--;
                      }
                      item.opinion = -1;
                      item.dislikes++;
                    }
                    this.setState({ moviesArray : this.state.moviesArray })
                  }}><FontAwesomeIcon icon="thumbs-down"/> {item.dislikes}</div>
                </div>
              )
            })}
        </div>
      </div>
    );
  }
}

export default App;
