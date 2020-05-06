import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Image} from 'react-native-elements';
import {Color, setSize} from '@/utils/global.js';
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    /**
     * @param:{
     *      name:'表头名',
     *      value:'与data的字段名相对应',
     *      width:100, //表格宽度  默认flex:1
     *      colCom: (v, i) => { //自定义组件名
     *       return null;
     *     },
     *
     * }
     */
    header: [],
    headerStyles: {}, //头部容器样式
    headerItemStyles: {}, //每一列表头样式
    headerTitleStyles: {}, //每一列表头文字样式
    rowStyles: {}, //每一行的样式
    colStyles: {}, //每一列的样式
    colTitleStyles: {}, //每一列文字样式
    data: [],
  };
  render() {
    let {
      header,
      headerStyles,
      headerItemStyles,
      headerTitleStyles,
      colStyles,
      rowStyles,
      colTitleStyles,
      data,
    } = this.props;
    return (
      <View style={styles.container}>
        {/* 表头 */}
        <View style={[styles.header, headerStyles]}>
          {header.map((obj, inx) => {
            return (
              <View
                key={inx + 'header'}
                style={[
                  styles.headerItem,
                  headerItemStyles,
                  obj.width ? {width: obj.width} : {flex: 1},
                ]}>
                <Text style={[styles.headerTitle, headerTitleStyles]}>
                  {obj.name ? obj.name : ''}
                </Text>
              </View>
            );
          })}
        </View>
        {/* 渲染数据 */}
        <View style={{paddingBottom: setSize(5)}}>
          {!data.length ? (
            <Text
              style={{
                fontSize: setSize(5),
                textAlign: 'center',
                color: Color.minText,
                paddingVertical: 5,
              }}>
              暂无数据...
            </Text>
          ) : (
            data.map((v, i) => {
              return (
                <View key={`${i}_row`} style={[styles.row, rowStyles]}>
                  {header.map((item, index) => {
                    return (
                      <View
                        key={`${i}_${index}_col`}
                        style={[
                          styles.col,
                          colStyles,
                          item.width ? {width: item.width} : {flex: 1},
                        ]}>
                        {item.colCom ? (
                          item.colCom(v, i)
                        ) : (
                          <Text style={[styles.colTitle, colTitleStyles]}>
                            {v[item.value] !== undefined ? v[item.value] : ''}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //   标头
  header: {
    height: setSize(15),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDD',
    paddingHorizontal: setSize(5),
  },
  headerItem: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: setSize(6),
    color: Color.infoText,
  },
  row: {
    paddingHorizontal: setSize(5),
    borderBottomColor: Color.minBorder,
    borderBottomWidth: 1,
    height: setSize(16),
    flexDirection: 'row',
  },
  //   列
  col: {
    justifyContent: 'center',
  },
  colTitle: {
    fontSize: setSize(5),
    color: Color.infoText,
    marginRight: 6,
  },
});
