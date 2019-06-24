import React from 'react';
import styles from './styles.css'

class DropdownItem extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <div>
            <a></a>
        </div>;
    }
}

//This component 
class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = { visible: false }
    }

    render() {
        return <div className={styles.label}>
            <div id="header">

            </div>
            <div id="container">
                
            </div>
        </div>;
    }

    componentDidMount() {

    }
    ToggleDropdown() {
        if (this.state.visible == true) {
            //Hide
        } else {
            //Show
        }
    }
}

export default Dropdown;
