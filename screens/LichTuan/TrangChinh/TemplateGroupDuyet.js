import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Styles from '../../Styles';

import { Layout, Text, Icon } from '@ui-kitten/components';

import TemplateDuyetHTML from './TemplateDuyetHTML';

const heightEx = 5;

export default class TemplateGroupDuyet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getNavigation: null,
            getParentUserId: null,
            expanded: true,
            displayDate: null,
            newJson: null,
            loading: true
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout>
                    <TouchableOpacity onPress={() => this.setState({ expanded: !this.state.expanded })}>
                        <Layout style={Styles.lt_grp_title}>
                            <Text status='control' style={Styles.flexDirectionRow}>
                                <Icon name='calendar-outline' width={18} height={18} fill='#fff' />
                                {' ' + this.state.displayDate}
                            </Text>
                        </Layout>
                    </TouchableOpacity>
                    <Layout style={this.state.expanded ? { minHeight: heightEx } : { maxHeight: heightEx }}>
                        {
                            this.state.newJson.nValue.map((item, key) => {
                                return (<TemplateDuyetHTML key={key} parItem={item} parUserID={this.state.getParentUserId} parInviK={true} parType={1} tabNavigation={this.state.getNavigation} parDuyet={this.props.parDuyet} />)
                            })
                        }
                    </Layout>
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentDidMount() {
        this.setState({
            getNavigation: this.props.tabNavigation,
            getParentUserId: this.props.parUserID,
            displayDate: this.props.parDisplayDate,
            newJson: this.props.parNewJson,
            loading: false
        })
    }
}
