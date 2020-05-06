<template>
  <div id="info">
    <div class="select_search">
      <div class="service">
        <label class="title">成员选择</label> &nbsp;
        <el-select v-model="member" filterable placeholder="请选择成员" @change="checkMenber($event)">
          <el-option
            v-for="item in memberList"
            :key="item.uid"
            :label="item.name"
            :value="item.uid"
          ></el-option>
        </el-select>
      </div>
      <div class="select">
        <label>排序方式</label>&nbsp;
        <el-select v-model="sortType" placeholder="请选择" @change="changrInfoType($event)">
          <el-option v-for="item in sort" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>

    <div class="table_title">
      <div class="title">健康信息统计</div>
      <div class="download" @click="importInfo">
        <img src="../../assets/imgs/import.png" alt />
        导出
      </div>
    </div>
    <div class="table">
      <table rules="none">
        <thead>
          <tr>
            <th>用户名</th>
            <th>生日</th>
            <th>账号(手机号)</th>
            <th>性别</th>
            <th>身高(cm)</th>
            <th>体重(kg)</th>
            <th>血型</th>
            <th>吸烟</th>
            <th>饮酒</th>
            <th>运动时间</th>
            <th>所属地区</th>
            <th>注册时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in tableList" :key="v.uid">
            <td>{{ v.name }}</td>
            <td>{{ v.birthday }}</td>
            <td>{{ v.tel }}</td>
            <td>{{ v.sex==0?'女':'男' }}</td>
            <td>{{ v.height }}</td>
            <td>{{ v.weight }}</td>
            <td>{{ v.bloodType }}</td>
            <td>{{ v.wasSmoke==0?'否':"是" }}</td>
            <td>{{ v.wasWine==0?'否':"是" }}</td>
            <td>{{ v.sportsTime==0?'1小时以下':v.sportsTime==1?'3小时以下': '3小时以上'}}</td>
            <td>{{ v.province }}</td>
            <td>{{ v.createTime }}</td>
          </tr>
        </tbody>
      </table>
      <img src="../../assets/imgs/rhombus.png" alt class="rhombuss" />
    </div>
    <div class="jupmPage">
      <el-pagination
        small="true"
        background="true"
        pager-count="6"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pacurrentges"
        :page-size="size"
        layout=" prev, pager, next,total, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import "./cover.css";
import IP, { infoType, getUserInfo, downloadInfo } from "@/apis/api";
import moment from "moment";
export default {
  data() {
    return {
      member: "",
      sortType: "1", //默认排序
      sort: [
        {
          value: "1",
          label: "最新创建"
        },
        {
          value: "2",
          label: "过去创建"
        },
        {
          value: "3",
          label: "年龄最大"
        },
        {
          value: "4",
          label: "年龄最小"
        }
      ],
      current: 1, //当前页
      total: 1, //总页
      size: 12, //每页请求信息
      tableList: [], //表格内容
      memberList: [] //用户列表
    };
  },
  created() {
    //默认时间最新查看
    this.getInfoType(this.current, this.size, this.sortType);
    this.memberList = JSON.parse(sessionStorage.family);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    importInfo() {
      window.open(
        IP +
          `/enterpris/exportMembers?type=${this.sortType}&tkt-user=${sessionStorage.tkt}`
      );
    },
    // 查找单个人信息
    checkMenber(val) {
      getUserInfo(val).then(res => {
        res.data.createTime = moment(res.data.createTime).format("YYYY-MM-DD");
        this.tableList = [res.data];
      });
    },
    // 改变排序方式
    changrInfoType(val) {
      this.member = "";
      this.getInfoType(1, 12, val);
    },
    handleCurrentChange(val) {
      this.getInfoType(val, this.size, this.sortType);
    },
    getInfoType(current, size, sortType) {
      infoType(current, size, sortType).then(res => {
        res.data.records.forEach(v => {
          v.createTime = moment(v.createTime).format("YYYY-MM-DD");
        });
        this.current = res.data.current;
        this.total = res.data.total;
        this.tableList = res.data.records;
      });
    }
  }
};
</script>

<style lang="less">
#info {
  width: 100%;
  height: 100%;
  & > .select_search {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #19e1e8;
    font-size: 0.7273rem;
    & > .service {
      display: flex;
      align-items: center;
    }
    & > .select {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
  }
  & > .table_title {
    font-size: 16px;
    margin-top: 1rem;
    color: #19e1e8;
    display: flex;
    justify-content: space-between;
    & > .title {
      background: url("../../assets/imgs/title_border.png") no-repeat;
      background-size: 100% 100%;
      width: 130px;
      text-align: center;
      padding: 8px 0;
    }
    & > .download {
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
      & > img {
        margin-right: 8px;
      }
    }
  }
  & > .table {
    width: calc(100% - 20px);
    height: 70%;
    padding: 10px;
    background: url("../../assets/imgs/table_border.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    table > tbody > tr,
    table > thead {
      display: table;
      width: 100%;
      table-layout: fixed; /* 重要  表格固定算法 */
    }
    & > table {
      height: 80%;
      width: 100%;
      height: 100%;
      background: rgba(23, 50, 74, 0.658);
      font-size: 0.7273rem;
      & > thead {
        width: calc(100% - 8px);
        tr {
          height: 2rem;
          line-height: 2rem;
          color: #fff;
          background: #0e1d44;
          font-size: 16px;
        }
      }
      & > tbody {
        height: 91%;
        display: block;
        overflow: auto;
        tr:nth-child(odd) {
          background: #21344ba9;
        }
        tr:nth-child(even) {
          background: #122339a1;
        }
        tr {
          height: 2rem;
          line-height: 2rem;
          color: #1ae8ff;
          td {
            text-align: center;
          }
        }
      }
    }

    & > .rhombuss {
      position: absolute;
      left: 0.5rem;
      bottom: 0.5rem;
    }
  }
  & > .jupmPage {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #1e577d;
    color: #19e1e8;
  }
}
</style>