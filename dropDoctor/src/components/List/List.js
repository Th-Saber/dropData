import React, {useState} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {Color} from '@/theme';
export default function List({
  data,
  style,
  _renderItem,
  onRefresh,
  border = true,
}) {
  const [refreshing, setRefreshing] = useState(false);
  //   下拉刷新寒素
  function _onDownRefresh() {
    setRefreshing(true);
    typeof onRefresh === 'function' &&
      onRefresh(() => {
        setRefreshing(false);
      });
  }
  // 边框线
  function showBorder() {
    let border_type = typeof border;

    switch (border_type) {
      case 'boolean':
        return (
          border && (
            <View
              style={{
                height: 2,
                backgroundColor: Color.line,
              }}
            />
          )
        );
      case 'object':
      case 'function':
        return border;

      default:
        return null;
    }
  }
  return (
    <FlatList
      data={data}
      style={style}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onDownRefresh}
          colors={[Color.primary]}
          progressBackgroundColor="#fff"
        />
      }
      keyExtractor={(item, index) => index + 'list'}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={showBorder}
      renderItem={_renderItem}
    />
  );
}
