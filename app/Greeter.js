/**
 * Created by beat on 17/2/16.
 */
import React,{Component} from 'react'
import config from './config.json';

class Greeter extends Component{
    render() {
        return (
            <div>
                {config.greetText}
            </div>
    );
    }
}
export default Greeter