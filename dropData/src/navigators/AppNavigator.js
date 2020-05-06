// import React from "react"
import {createStackNavigator} from 'react-navigation-stack';
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'; //转场动画
import {connect} from 'react-redux';
//导入页面组件
import EnterPage from '@/pages/EnterPage.js';
import Login from '@/pages/Login/Login';
import ForgetPass from '@/pages/Login/ForgetPass';
import Nav from '@/layout/Nav/Nav';
//----------公用组件-----------
import Camera from '@/component/Camera'; //二维码
import PhotoWall from '@/component/PhotoWall'; //照片墙
import ImgZoom from '@/component/ImgZoom'; //照片预览

//----------我的-----------
import Address from '@/pages/My/Address'; //地址管理
import AddAddress from '@/pages/My/AddAddress'; //添加地址
import Daily from '@/pages/My/Daily'; //日报
import Equipment from '@/pages/My/Equipment'; //设备管理
import VidioDemo from '@/pages/My/VidioDemo'; //使用演示
import Exchange from '@/pages/My/Exchange'; //兑换
import Withdrawal from '@/pages/My/Withdrawal'; //账户提现
import AddUser from '@/pages/My/AddUser'; //添加成员
import AddUserAre from '@/pages/My/AddUserAre'; //添加已注册
import EditUserTel from '@/pages/My/EditUserTel'; //下一步输入用户电话号码
import ScoreInfo from '@/pages/My/ScoreInfo'; //积分详情
import SetUserName from '@/pages/My/SetUserName'; //添加用户名
import Setting from '@/pages/My/Setting'; //设置
import Consulting from '@/pages/My/Consulting'; //健康咨询
import PassSet from '@/pages/My/PassSet'; //健康咨询
import Contact from '@/pages/My/Contact'; //健康咨询
import AddContact from '@/pages/My/AddContact';
//----------健康-----------
import UrineInfo from '@/pages/HealthData/UrineInfo'; //尿常规检测仪
import IndexDetail from '@/pages/HealthData/IndexDetail'; //尿常规检测仪
//----------社区-----------
import ReleaseNews from '@/pages/Community/ReleaseNews'; //发布新闻
import HisHome from '@/pages/Community/HisHome'; //TA的主页
import MsgDetial from '@/pages/Community/MsgDetial'; //消息详情
import Comments from '@/pages/Community/Comments'; //消息详情
import NewsStateList from '@/pages/Community/NewsStateList'; //赞和评论列表
import AddressBook from '@/pages/Community/AddressBook'; //通讯录
//----------社区-----------
import Opinion from '@/pages/Supplier/Opinion'; //商务合作 关于我们 招聘贤能
import SupCom from '@/pages/Supplier/SupCom'; //意见反馈

function filter(state) {
  return {
    data: state,
  };
}

//配置路由页面
export function getAppStackNavigator() {
  const AppStackNavigator = createStackNavigator(
    {
      // 引导页
      EnterPage: {
        screen: EnterPage,
        navigationOptions: {
          header: null,
        },
      },
      // 导航首页
      Nav: {
        screen: connect(filter)(Nav),
        navigationOptions: {
          header: null,
        },
      },
      // 登陆
      Login: {
        screen: connect(filter)(Login),
        navigationOptions: {
          header: null,
        },
      },
      // 忘记密码
      ForgetPass: {
        screen: ForgetPass,
        navigationOptions: {
          header: null,
        },
      },
      //    ------------------我的------------------//
      // 地址管理
      Address: {
        screen: Address,
        navigationOptions: {
          header: null,
        },
      },
      // 添加地址
      AddAddress: {
        screen: AddAddress,
        navigationOptions: {
          header: null,
        },
      },
      // 健康日报
      Daily: {
        screen: connect(filter)(Daily),
        navigationOptions: {
          header: null,
        },
      },
      // 设置
      Setting: {
        screen: connect()(Setting),
        navigationOptions: {
          header: null,
        },
      },
      // 健康咨询
      Consulting: {
        screen: Consulting,
        navigationOptions: {
          header: null,
        },
      },
      // 设备管理
      Equipment: {
        screen: connect(filter)(Equipment),
        navigationOptions: {
          header: null,
        },
      },
      // 使用演示
      VidioDemo: {
        screen: VidioDemo,
        navigationOptions: {
          header: null,
        },
      },
      // 0元兑换
      Exchange: {
        screen: Exchange,
        navigationOptions: {
          header: null,
        },
      },
      // 账户提现
      Withdrawal: {
        screen: Withdrawal,
        navigationOptions: {
          header: null,
        },
      },
      // 添加用户
      AddUser: {
        screen: connect(filter)(AddUser),
        navigationOptions: {
          header: null,
        },
      },
      // 添加已存在用户
      AddUserAre: {
        screen: connect(filter)(AddUserAre),
        navigationOptions: {
          header: null,
        },
      },
      // 添加已存在用户 下一步添加账号
      EditUserTel: {
        screen: EditUserTel,
        navigationOptions: {
          header: null,
        },
      },
      // 积分详情
      ScoreInfo: {
        screen: connect(filter)(ScoreInfo),
        navigationOptions: {
          header: null,
        },
      },
      // 添加用户名
      SetUserName: {
        screen: SetUserName,
        navigationOptions: {
          header: null,
        },
      },
      // 密码设置
      PassSet: {
        screen: PassSet,
        navigationOptions: {
          header: null,
        },
      },
      //   紧急联系人
      Contact: {
        screen: Contact,
        navigationOptions: {
          header: null,
        },
      },
      //   添加紧急联系人
      AddContact: {
        screen: AddContact,
        navigationOptions: {
          header: null,
        },
      },
      //-----------------------健康----------------//
      //    尿常规检测仪
      UrineInfo: {
        screen: UrineInfo,
        navigationOptions: {
          header: null,
        },
      },
      //    指数解读
      IndexDetail: {
        screen: IndexDetail,
        navigationOptions: {
          header: null,
        },
      },
      //-----------------------社区----------------//
      //    尿常规检测仪
      ReleaseNews: {
        screen: ReleaseNews,
        navigationOptions: {
          header: null,
        },
      },
      //    他的主页
      HisHome: {
        screen: connect(filter)(HisHome),
        navigationOptions: {
          header: null,
        },
      },
      //    消息详情
      MsgDetial: {
        screen: connect(filter)(MsgDetial),
        navigationOptions: {
          header: null,
        },
      },
      //  评论列表
      Comments: {
        screen: Comments,
        navigationOptions: {
          header: null,
        },
      },
      //  赞 和评论列表
      NewsStateList: {
        screen: connect(filter)(NewsStateList),
        navigationOptions: {
          header: null,
        },
      },
      //---------------供方平台--------------------//
      Opinion: {
        screen: Opinion,
        navigationOptions: {
          header: null,
        },
      },
      SupCom: {
        screen: SupCom,
        navigationOptions: {
          header: null,
        },
      },
      //---------------公用组件页面--------------------//
      // 通讯录
      AddressBook: {
        screen: connect(filter)(AddressBook),
        navigationOptions: {
          header: null,
        },
      },
      // 二维码
      Camera: {
        screen: Camera,
        navigationOptions: {
          header: null,
        },
      },
      // 照片墙
      PhotoWall: {
        screen: PhotoWall,
        navigationOptions: {
          header: null,
        },
      },
      // 照片放大
      ImgZoom: {
        screen: ImgZoom,
        navigationOptions: {
          header: null,
        },
      },
    },
    {
      mode: 'card',
      headerMode: 'screen',
      transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
      }),
    },
  );
  return AppStackNavigator;
}
// export
