/**
 * Created by beat on 17/2/16.
 */
import React,{Component} from 'react'
import config from './config.json';
import styles from './greeter.css';//导入

class Greeter extends Component{
    render() {
        return (
            <div className={styles.root}>
                {config.greetText}
            </div>
    );
    }
}
export default Greeter