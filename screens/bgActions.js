import React, {Component} from 'react';
// Optional flow type
import type, { NotificationOpen } from 'react-native-firebase';
import Jazz from './jazz'
import {createSwitchNavigator,createAppContainer} from 'react-navigation'

export default class BgActions extends Component{
    componentDidMount(){
        async (notificationOpen: NotificationOpen) => {
            if (notificationOpen.action1 === 'Interested!') {
                this.props.navigation.navigate("Jazz")
        
            }else if(notificationOpen.action2 === 'Ignore'){
                // handle the action
                console.log("Bambi");
            }
            
            return Promise.resolve();
        }
    }

    render(){
        return(
            <AppContainer/>
        )
    }
}


const appNavigator = createSwitchNavigator({
    BgActions:BgActions,
    Jazz:Jazz
})

const AppContainer = createAppContainer(appNavigator);