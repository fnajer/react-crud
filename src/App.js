import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import loadingGif from './loading.gif';
import './App.css';
import ListItem from './ListItem.jsx';

class App extends Component {
  constructor() {
    super();

    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };
    this.apiUrl = 'https://5b5b569d50bab80014e5f857.mockapi.io';

    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }
  
  async componentDidMount() {
    let response = await axios.get(`${this.apiUrl}/todos`);

    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      });
    }, 1000);
  }

  alert(notification) {
    this.setState({ 
      notification: notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);

  }

  async addTodo() {
    
    let response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    });

    let todos = this.state.todos; // по-хорошему, мы уже меняем состояние. Нужно создавать копию массива, чтобы избежать этого. Но нужно ли оно?
    todos.push(response.data); // ведь тут создается не копия, а ссылка на существующий массив

    this.setState({
      todos: todos
    });

    this.alert('Todo created successfully');
  }
  
  editTodo(index) {

    let todo = this.state.todos[index];

    this.setState({
      newTodo: todo.name,
      editing: true,
      editingIndex: index
    });
  }

  async updateTodo() {
    let todo = this.state.todos[this.state.editingIndex];

    let response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    this.state.todos[this.state.editingIndex] = response.data;

    this.setState({
      editing: false,
      editingIndex: null,
      newTodo: ''
    });

    this.alert('Todo updated successfully');
  }

  async deleteTodo(index) {
    let todos = this.state.todos;
    let todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    todos.splice(index, 1);

    this.setState({
      todos: todos
    });

    this.alert('Todo deleted successfully');
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CRUD React</h1>
        </header>
        <div className="container">

          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }

          <input 
            type="text"
            name="todo"
            className="my-4 form-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo}
          />
          <button
            className="btn-success mb-3 form-control"
            onClick={this.state.editing ? this.updateTodo : this.addTodo}
            disabled={this.state.newTodo.length < 5}>
            {this.state.editing ?  'Update todo' : 'Add todo'}
          </button>
          
          {
            this.state.loading &&
            <img src={loadingGif} alt="loading"/>
          }

          {

            (!this.state.editing || this.state.loading) &&
            <ul className="list-group">
              
              {this.state.todos.map((item, index) => {
                return <ListItem
                          key={item.id}
                          item={item}
                          editTodo={() => { this.editTodo(index) }}
                          deleteTodo={() => { this.deleteTodo(index) }}                         
                        />

              })}

            </ul>   
          }

        </div>
      </div>
    );
  }
}

export default App;
