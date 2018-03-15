import React, { Component } from 'react';
import lodash from 'lodash';
const todos = [
  {
    task: 'make react tutorial',
    isCompleted: false
  },
  {
    task: 'make dinner',
    isCompleted: true
  }
]

class Input extends Component {
  //need to assign input and priority list MUST be filled/selected
  constructor(props) {
    super(props);

    this.updateStateValue = this.updateStateValue.bind(this);
    //this.clickAdd = this.clickAdd.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  updateStateValue(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // clickAdd(todo) {
  //   if (todo.length < 0) {
  //     this.props.clickAdd(todo);
  //     this.setState({
  //       input: ''
  //     })
  //   }
  //}

  handleCreate(event) {
    event.preventDefault();
    this.props.createTask(this.refs.createInput.value);
    this.refs.createInput.value = '';
  }

  render() {
    return (
      <form className="card" onSubmit={this.handleCreate}>
        <p className="card-header">Add New ToDo</p>
        <div className="card-body">
          <p className="card-text">I want to...
      <textarea name="input" className="form-control" onChange={this.updateStateValue} ref="createInput" />
          </p>
          <p className="card-text">How much of a priority is this?
        <select name="dropdown" className="col-md-12" >
              <option hidden value='ella'>Select a Priority</option>
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
  }

  //this is where you can turn the section green or red when its done or not
  //this is where you will probably add the priority component
  renderTaskSection() {
    const {task, isCompleted } = this.props;
    const taskStyle = {
      color: isCompleted ? 'green' : 'red',
      cursor: 'pointer'
    };

    return (
      <td style={taskStyle}>{task}</td>
    )

  }
  //when the edit button is click, the following button is shown
  renderActionSection() {
    if (this.state.isEditing) {
      return (
        <td>
          <button className="btn btn-info">Save</button>
          <button className="btn btn-warning" onClick={this.onCancelClick}>Cancel</button>
        </td>
      );
    }
    return (
      <td>
        <button className="btn btn-info" onClick={this.onEditClick}>Edit</button>
        <button className="btn btn-warning">Delete</button>
      </td>
    );
  }

  //when edit is clicked, the editing turns true
  onEditClick() {
    this.setState({ isEditing: true });
  }

  onCancelClick() {
    this.setState({ isEditing: false });
  }

  render() {
    return (
      <tr className="border border-secondary">
        {this.renderTaskSection()}
        {this.renderActionSection()}
      </tr>
    )
  }

}


class ToDoList extends Component {
  renderItems() {
    return _.map(this.props.todos, (todo, index) => <TodosListItem key={index} {...todo} />)

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
      todos
    }
    this.createTask = this.createTask.bind(this);
  }

  createTask(task) {
    this.state.todos.push({
      task,
      isCompleted: false
    });
    this.setState({
      todos: this.state.todos
    })
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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
