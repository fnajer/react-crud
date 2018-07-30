import React, { Component } from 'react';

class ListItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <li className="list-group-item">
                  <button 
                    className="btn-sm mr-4 btn btn-info"
                    onClick={this.props.editTodo}>
                    U
                  </button>
                  {this.props.item.name}
                  <button 
                    className="btn-sm ml-4 btn btn-danger"
                    onClick={this.props.deleteTodo}>
                    X
                  </button>
                </li>
	}
}

export default ListItem;