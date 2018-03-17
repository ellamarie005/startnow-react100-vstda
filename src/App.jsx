import React, { Component } from 'react';
import lodash from 'lodash';

class Input extends Component {
  //need to assign input and priority list MUST be filled/selected
  constructor(props) {
    super(props);

    this.updateStateValue = this.updateStateValue.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  updateStateValue(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleCreate(event) {
    event.preventDefault();
    this.props.createTask(this.refs.createInput.value, this.refs.createPriority.value);
    this.refs.createInput.value = '';
    this.refs.createPriority.value = 0;
  }

  render() {
    return (
      <form className="card" onSubmit={this.handleCreate}>
        <p className="card-header">Add New ToDo</p>
        <div className="card-body">
          <p className="card-text">I want to...
      <textarea name="input" className="create-todo-text form-control" onChange={this.updateStateValue} ref="createInput" />
          </p>
          <p className="card-text">How much of a priority is this?
        <select className="create-todo-priority col-md-12" name="dropdown" ref="createPriority">
              <option hidden value='0'>Select a Priority</option>
              <option className="alert alert-success" value="1">Ehh...Not Important</option>
              <option className="alert alert-warning" value="2">It's Kinda Important</option>
              <option className="alert alert-danger" value="3">Ohh Yeahh, Very Important!</option>
            </select></p>
        </div>
        <div className="card-footer">
          <button className="btn col-md-12 p-2 bg-danger text-white">Add</button>
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

  renderTaskSection() {
    // const {task, isCompleted } = this.props;
    // const taskStyle = {
    //   color: isCompleted ? 'green' : 'red',
    //   cursor: 'pointer'
    // };

    if (this.state.isEditing) {
      return (
        <td>
          <form onSubmit={this.onSaveClick.bind(this)}>
            <textarea className="update-todo-text card p-3 col-md" type="text" defaultValue={this.props.task} ref="editInput" />
            <p className="card-text">How much of a priority is this?
        <select className="update-todo-priority" className="col-md-12" defaultValue={this.props.priority} ref="editPriority">
                <option hidden value='0'>Select a Priority</option>
                <option className="alert alert-success" value="1">Ehh...Not Important</option>
                <option className="alert alert-warning" value="2">It's Kinda Important</option>
                <option className="alert alert-danger" value="3">Ohh Yeahh, Very Important!</option>
              </select></p>
          </form>
        </td>
      )
    }
    return (
      <td>{this.props.task}{this.props.priority}</td>
    )
  }
  //when the edit button is click, the following button is shown
  renderActionSection() {
    if (this.state.isEditing) {
      return (
        <td className="d-flex flex-row-reverse">
          <a className="btn btn-warning" onClick={this.onCancelClick}>Cancel</a>
          <a className="update-todo btn btn-info" onClick={this.onSaveClick}>Save</a>
        </td>
      );
    }
    return (
      <td className="d-flex flex-row-reverse">
        <a className="delete-todo btn btn-warning" onClick={this.props.deleteTask.bind(this, this.props.task)}>Delete</a>
        <a className="edit-todo btn btn-info" onClick={this.onEditClick}>Edit</a>
      </td>
    );
  }

  //when edit is clicked, the editing turns true
  onEditClick() { this.setState({ isEditing: true }); }

  onCancelClick() { this.setState({ isEditing: false }); }

  onSaveClick(event) {
    event.preventDefault();
    const oldTask = this.props.task;
    const newTask = this.refs.editInput.value;
    const oldPriority = this.props.priority;
    const newPriority = this.refs.editPriority.value;
    this.props.saveTask(oldTask, newTask, oldPriority, newPriority);
    this.setState({ isEditing: false });
  }

  render() {
    return (
      <tr>
        {this.renderTaskSection()}
        {this.renderActionSection()}
      </tr>
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
          <table className="col-md">
            <tbody>
              {this.renderItems()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priority: 0,
      todos: [
        {
          task: 'make react tutorial',
          isCompleted: false,
          priority: 1
        },
        {
          task: 'make dinner',
          isCompleted: true,
          priority: 2
        }
      ]
    }
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.saveTask = this.saveTask.bind(this);
  }

  createTask(task, priority) {
    this.state.todos.push({
      task,
      priority,
      isCompleted: false
    });
    this.setState({ todos: this.state.todos })
  }

  saveTask(oldTask, newTask, oldPriority, newPriority) {
    const foundTodo = _.find(this.state.todos, todo => todo.task === oldTask);
    const foundPriority = _.find(this.state.todos, todo => todo.priority === oldPriority);
    foundTodo.task = newTask;
    foundPriority.priority = newPriority;
    this.setState({ todos: this.state.todos, priority: this.state.todos });
  }

  deleteTask(deletingTask) {
    _.remove(this.state.todos, todo => todo.task === deletingTask);
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
            <Input createTask={this.createTask} />
          </div>
          <div className="col-md">
            <ToDoList
              todos={this.state.todos}
              deleteTask={this.deleteTask}
              saveTask={this.saveTask}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
