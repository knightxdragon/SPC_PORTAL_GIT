import React, { Component } from "react";
import { Modal } from 'react-native';
import DangNhapScreen from '../screens/DangNhapScreen';

export default class ModalLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: null
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.visible}
            >
                <DangNhapScreen updateParentState={this.updateState.bind(this)} flagLogin={true} />
            </Modal>
        )
    }
    
    componentDidMount() {
        this.setState({
            visible: this.props.visible
        })
    }

    updateState(data) {
        this.setState({
            visible: data.flag
        });
    }
}