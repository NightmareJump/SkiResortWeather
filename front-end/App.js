import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/skiResorts') 
      .then(response => {
        setResorts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderResortItem = ({ item }) => {
    // 这里只是演示布局。如果你有 logo 地址，可用 <Image> 显示。
    // 如果没有 logo，可以只显示名称。

    return (
      <View style={styles.rowContainer}>
        
        {/* 左侧：Logo + 名称 */}
        <View style={styles.leftSection}>
          {/* 如果有 logo 字段，可以写成： 
              <Image source={{ uri: item.logo }} style={styles.logo} />
          */}
          <Text style={styles.resortName}>{item.name}</Text>
        </View>
        
        {/* 中间或右侧：若想模拟截图中三列降雪数据 */}
        <View style={styles.snowColumn}>
          <Text style={styles.snowValue}>{item.snowfall ?? 0} cm</Text>
          <Text style={styles.snowLabel}>24小时降雪</Text>
        </View>

        {/* 如果你有 7 天降雪字段（例如 item.snow7d），可显示；如果没有，先写死或隐藏 */}
        <View style={styles.snowColumn}>
          <Text style={styles.snowValue}>0 cm</Text>
          <Text style={styles.snowLabel}>7天降雪</Text>
        </View>

        {/* 如果你有全年降雪字段，也同理；没有就先占位 */}
        <View style={styles.snowColumn}>
          <Text style={styles.snowValue}>0 cm</Text>
          <Text style={styles.snowLabel}>全年降雪</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        加拿大滑雪场雪况
      </Text>

      <FlatList
        data={resorts}
        keyExtractor={item => item._id}
        renderItem={renderResortItem}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',        // 水平布局
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'    // 简易分割线
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,                  // 给左侧区域固定宽度（或用 flex）
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5
  },
  resortName: {
    fontSize: 15,
    fontWeight: '600',
  },
  // 三个降雪列公用的样式
  snowColumn: {
    width: 60,                   // 每列 60 宽，根据实际需求可调整
    alignItems: 'center'
  },
  snowValue: {
    fontSize: 16,
    color: '#00f',              // 蓝色
    fontWeight: 'bold',
  },
  snowLabel: {
    fontSize: 12,
    color: '#666',              // 灰色
    marginTop: 2
  }
});
