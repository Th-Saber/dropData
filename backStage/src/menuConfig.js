const menuConfig = [{
        path: "/home",
        name: "首页",
        icon: 'el-icon-monitor',
        for: false
    },
    {
        path: "/message",
        name: "消息管理",
        icon: 'el-icon-chat-dot-square',
        for: false
    },
    {
        name: "系统设置",
        icon: 'el-icon-setting',
        for: true,
        children: [{
                path: '/carousel',
                name: '轮播图管理'
            },
            {
                path: '/named',
                name: '规则设置'
            },
            {
                path: '/autoReply',
                name: '自动回复设置'
            },
        ]
    },
    {
        path: "/business",
        name: "内容管理",
        icon: 'el-icon-document-copy',
        for: false
    },
    {
        path: "/newEquipment",
        name: "设备管理",
        icon: 'el-icon-menu',
        for: false,
    },
    {

        name: "用户管理",
        icon: 'el-icon-user',
        for: true,
        children: [{
                path: 'feedback',
                name: '用户反馈'
            }, {
                path: 'accData',
                name: '用户资料'
            },
            {
                path: 'health',
                name: '用户健康信息'
            },
        ]
    },
    {
        path: "/role",
        name: "角色管理",
        icon: 'el-icon-paperclip',
        for: false
    },
    // {
    //   name: "权限设置",
    //   icon: 'el-icon-paperclip',
    //   for: true,
    //   children: [{
    //       path: 'account',
    //       name: '账号管理'
    //     },
    //     {
    //       path: 'permission',
    //       name: '权限管理'
    //     },
    //   ]
    // },
];
export {
    menuConfig
};