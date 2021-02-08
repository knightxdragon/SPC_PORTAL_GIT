import React, { Component } from "react";
import { TouchableOpacity } from 'react-native'
import { Container, Content, Icon, Accordion, Text, View, Card, CardItem, Body, Button } from "native-base";
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import Session from '../../components/Session';
import MyActivityIndicator from '../../components/MyActivityIndicator';

export default class MainGSCV extends Component {
  constructor(props) {
    super(props);

    this.state = {
        userID: null,
        dataSource: [],
        loading: true
    }
  }

  static navigationOptions = {
    title: 'Giám sát công việc',
  };

  componentDidMount() {
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    Session.getUserInfo().then((goals) => {
        this.setState({
            userID: goals.UserId
        })

        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetDanhSachThang';
        return fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "UserId": goals.UserId,
            "Thang": month,
            "Nam": year,
            "LoaiDuAn": ""
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            var result = [];
            
            responseJson.forEach(function (e, i) {
              if (!this[e.TenLoaiDuAn]) {
                this[e.TenLoaiDuAn] = {
                  title: e.TenLoaiDuAn,
                  content: []
                }
                this[e.TenLoaiDuAn].content.push(e)
                result.push(this[e.TenLoaiDuAn])
              } else {
                this[e.TenLoaiDuAn].content.push(e)
              }
            }, {})
            
            this.setState({
              dataSource: result,
              loading: false
            }, function () {
            });
          })
          .catch((error) => {
            console.error(error);
          });
    });
  }

  _renderHeader(item, expanded) {
    return (
      <View style={Styles.gscv_header}>
        <Text style={Styles.gscv_txtHeader}>
          {""}{item.title}
        </Text>
        {expanded
          ? <Icon style={Styles.gscv_iconHeader} name="ios-arrow-down" />
          : <Icon style={Styles.gscv_iconHeader} name="ios-arrow-up" />}
      </View>
    );
  }

  _renderContent(item) {
    const { navigate } = this.props.navigation;
    
    const lapsList = item.content.map((data, index) => {
      return (
        <Card key={index}>
          <CardItem>
            <Body>
              <Grid>
                <Row>
                  <Col style={Styles.gscv_colTitleContent}>
                    <TouchableOpacity onPress={() => navigate('DanhSachMain', { title: item.title, idDT: data.IdDoiTuong })} >
                      <Text style={Styles.gscv_titleContent}>{data.TenDoiTuong}</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
                <Text note>
                  Chưa: <Text style={Styles.gscv_number}>{data.ChuaGQ}</Text> -
                  Đã: <Text style={Styles.gscv_number}>{data.DaGQ}</Text> -
                  Quá hạn: <Text style={Styles.gscv_number}>{data.QuaHan}</Text> -
                  HT quá hạn: <Text style={Styles.gscv_number}>{data.HTQuaHan}</Text>
                </Text>
              </Grid>
            </Body>
          </CardItem>
        </Card>
      )
    })
    return (
      <View>
        {lapsList}
      </View>
    );
  }

  conditionRender() {
    const { navigate } = this.props.navigation;
    
    if (this.state.dataSource.length > 0) {
      return (
        <Container>
          <Content padder>
            <Accordion
              dataArray={this.state.dataSource}
              animation={true}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent.bind(this)}
              expanded={0}
            />
          </Content>
        </Container>
      );
    }
    else {
      return (
        <View style={Styles.content}>
          <Text style={Styles.lbError}>{ ErrorMessage.ERROR_GIAMSATCONGVIEC }</Text>
        </View>
      )      
    }  
  }

  render() {
      if (!this.state.loading) {
          return (
            this.conditionRender()
          )
      }
      else {
          return <MyActivityIndicator />
      }
  }
}