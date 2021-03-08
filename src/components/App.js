// import logo from './logo.svg';
import React from 'react';

async function sendAdd(mess) {

    let requestPost = await fetch('/toDoPage/addTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(mess)
    });
    let result = await requestPost.text();
    console.log(result)
};

async function sendChange(mess) {

    let requestPost = await fetch('/toDoPage/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(mess)
    });
    let result = await requestPost.text();
    console.log(result)
};

async function clearDB() {
    let requestClear = await fetch('/toDoPage/clear',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify()
        });
    let res = await requestClear.text();
    console.log(res);
};

async function delOneTask(mess) {
    let requestClear = await fetch('/toDoPage/delOneTask',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(mess)
        });
    let res = await requestClear.text();
    console.log(res);
}

class DelButton extends React.Component {

    constructor(props) {
        super(props);
        this.removInformation = this.removInformation.bind(this);
    }

    removInformation(e) {
        let numDiv = e.target.parentElement.className;
        this.props.filter(numDiv);
    }

    render() {
        return (
            < input onClick={this.removInformation} style={{ marginLeft: 50 }} type="button" id="but" value="удалить" />
        )
    }
}

const OneTask = props =>
    <input type="checkbox" checked={props.check} />;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        };
        this.add = this.add.bind(this);
        this.clear = this.clear.bind(this);
        this.changeStyle = this.changeStyle.bind(this);
        this.delTask = this.delTask.bind(this);
    };

    delTask(numDiv) {
        numDiv = Number(numDiv);
        delOneTask({ idTask: this.state.tasks[numDiv].time });
        this.state.tasks.splice(numDiv, 1)
        this.setState({ tasks: this.state.tasks })
    }

    changeStyle(e) {
        let classIndex = Number(e.target.parentElement.className);
        let textInfo = e.target.parentElement.textContent;
        let timeOfCreation = this.state.tasks[classIndex].time;

        let textDecor = (e.target.parentElement.style.textDecoration === 'none') ?
            {
                task: textInfo,
                styles: { textDecoration: 'line-through' },
                checkBoxStatus: true,
                time: timeOfCreation,
                checkComponent: true
            } :
            {
                task: textInfo,
                styles: { textDecoration: "none" },
                checkBoxStatus: false,
                time: timeOfCreation,
                checkComponent: false
            };

        sendChange({ idTask: timeOfCreation, task: JSON.stringify(textDecor) });

        this.state.tasks[classIndex] = textDecor;
        this.setState({ tasks: this.state.tasks })
    }

    async componentDidMount() {
        let requestGet = await fetch('/toDoPage/tasks');
        let message = await requestGet.json();

        message = message.map(item => item.task = JSON.parse(item.task));

        this.setState({ tasks: message });
    }

    add() {
        let timeAddTask = `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`;

        let text = document.getElementById('string').value;

        let obj = {
            task: text,
            styles: { textDecoration: "none" },
            checkBoxStatus: false,
            time: timeAddTask,
            checkComponent: false
        }

        this.state.tasks.push(obj);

        sendAdd({
            task: JSON.stringify(obj),
            idTask: timeAddTask
        });

        this.setState({ tasks: this.state.tasks });
        document.getElementById('string').value = null;
    }

    clear() {
        clearDB();
        this.setState({ tasks: [] })
    }

    render() {
        let variable = < DelButton filter={this.delTask} />;

        return <div>
            <p>My ToDo </p>
            <div onChange={this.changeStyle}>
                {
                    this.state.tasks.map(function (item, ind) {
                        let comp = (item.checkBoxStatus === false) ? null : variable;
                        return <div className={ind} style={item.styles} key={ind} >
                            < OneTask check={item.checkBoxStatus} />{item.task}{comp}</div>
                    })
                }
            </div>
            <p>
                <input type="text" id="string" />
                < input onClick={this.add} type="button" id="but" value="add" />
                <input onClick={this.clear} type="button" id="clear" value="clear" />
            </p >
        </div >
    }
}
export default App;
