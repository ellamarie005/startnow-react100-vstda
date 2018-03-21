import React, { Component } from 'react';
import lodash from 'lodash';

class Input extends Component {
  //instead of creating a constructor for the .bind() command, you can bind it on the actual button.
  updateStateValue(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCreate(event) {
    event.preventDefault();
    this.props.createTodo(this.refs.createInput.value, this.refs.createPriority.value);
    this.refs.createInput.value = '';
    this.refs.createPriority.value = 0;
  }

  render() {
    return (
      <form className="card" onSubmit={this.handleCreate.bind(this)}>
        <p className="card-header">Add New ToDo</p>
        <div className="card-body">
          <p className="card-text">I want to...
      <textarea name="input" className="create-todo-text form-control" onChange={this.updateStateValue.bind(this)} ref="createInput" />
          </p>
          <p className="card-text">How much of a priority is this?
        <select className="create-todo-priority col-md-12" ref="createPriority">
              <option hidden value='0'>Select a Priority</option>
              <option value="1">Ehh...Not Important</option>
              <option value="2">It's Kinda Important</option>
              <option value="3">Ohh Yeahh, Very Important!</option>
            </select></p>
        </div>
        <div className="card-footer">
          <button className="create-todo btn col-md-12 p-2 bg-danger text-white">Add</button>
        </div>
      </form>
    );
  }
}

class TodosListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    }
    this.onEditClick = this.onEditClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
  }
  //when the edit button is click, the following button is shown
  renderActionSection() {
    if (this.state.isEditing) {
      return (
        <div>
          <form onSubmit={this.onSaveClick.bind(this)}>
            <div className='m-2'>
              <p><strong>Description</strong>
                <textarea className="update-todo-text card p-1 col-md" type="text" defaultValue={this.props.todo} ref="editInput" />
                <strong>Priority</strong>
                <select className="update-todo-priority" className="col-md-12" defaultValue={this.props.priority} ref="editPriority">
                  <option hidden value='0'>Select a Priority</option>
                  <option value="1">Ehh...Not Important</option>
                  <option value="2">It's Kinda Important</option>
                  <option value="3">Ohh Yeahh, Very Important!</option>
                </select>
                <button className="update-todo btn btn-success m-2" onClick={this.onSaveClick}>Save</button>
                <button className="btn btn-danger m-2" onClick={this.onCancelClick}>Cancel</button>
              </p>
            </div>
          </form>
        </div>
      );
    }
    return (
      <div className='p-1 m-2'>
        <input id="checkBox" type="checkbox" className='mr-2' />
        <strong className='m-1'>{this.props.todo}</strong>
        <a className="delete-todo" onClick={this.props.deleteTodo.bind(this, this.props.todo)}><i className='fa fa-trash-o fa-lg float-right m-1'></i></a>
        <a className="edit-todo" onClick={this.onEditClick}><i className='fa fa-edit fa-lg float-right m-1'></i></a>
      </div>
    );
  }

  //when edit is clicked, the editing turns true
  onEditClick() { this.setState({ isEditing: true }); }
  onCancelClick() { this.setState({ isEditing: false }); }

  onSaveClick(event) {
    event.preventDefault();
    const oldTodo = this.props.todo;
    const newTodo = this.refs.editInput.value;
    const oldPriority = this.props.priority;
    const newPriority = this.refs.editPriority.value;
    this.props.saveTodo(oldTodo, newTodo, oldPriority, newPriority);
    this.setState({ isEditing: false });
  }

  render() {
    return (
      <div className={this.props.priority == 1 ? 'alert-success' : this.props.priority == 2 ? 'alert-warning' : 'alert-danger'} role='alert'>
        {this.renderActionSection()}
      </div>
    )
  }
}

class ToDoList extends Component {
  renderItems() {
    const props = _.omit(this.props, 'todos');
    return _.map(this.props.todos, (todo, index) => <TodosListItem key={index} {...todo} {...props} />)
  }

  render() {
    return (
      <div className="card">
        <p className="card-header">View ToDos</p>
        <div>
          <div className="alert alert-info">
            <strong>Welcome to Very Simple ToDo App</strong>
            <p>Get starter now by adding a new todo on the left.</p>
          </div>
          <ul className='list-unstyled'>
            <li className='success'>
              {this.renderItems()}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    }
    this.createTodo = this.createTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
  }

  createTodo(todo, priority) {
    this.state.todos.push({
      todo,
      priority,
    });
    this.setState({ todos: this.state.todos })
  }

  saveTodo(oldTodo, newTodo, oldPriority, newPriority) {
    const foundTodo = _.find(this.state.todos, todo => todo.todo === oldTodo);
    const foundPriority = _.find(this.state.todos, todo => todo.priority === oldPriority);
    foundTodo.todo = newTodo;
    foundPriority.priority = newPriority;
    this.setState({ todos: this.state.todos });
  }

  deleteTodo(deletingTodo) {
    _.remove(this.state.todos, todo => todo.todo === deletingTodo);
    this.setState({ todos: this.state.todos });
  }

  render() {
    return (
      <div className='container'>
        <h1 className="text-white">Very Simple ToDo App</h1>
        <p className="text-white">Track all the things</p>
        <hr className="bg-light"></hr>
        <div className="row">
          <div className="col-md-4">
            <Input createTodo={this.createTodo} />
          </div>
          <div className="col">
            <ToDoList
              todos={this.state.todos}
              deleteTodo={this.deleteTodo}
              saveTodo={this.saveTodo}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
