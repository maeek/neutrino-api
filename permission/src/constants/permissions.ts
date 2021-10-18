const user = ['user_get', 'user_set', 'user_remove'];

export const permissions = [...user];

// export const SCOPES_ENUM = {
//   user: {
//     _all: 'user/(get|settings|remove|avatar|set)',
//     get: 'user/get',
//     set: 'user/set',
//     remove: 'user/remove',
//     admin: {
//       scope: 'user/admin/scope',
//     },
//     settings: {
//       _all: 'user/settings/*',
//       get: 'user/settings/get',
//       add: 'user/settings/add',
//       remove: 'user/settings/remove',
//     },
//     avatar: {
//       get: 'user/avatar/get',
//       set: 'user/avatar/set',
//     },
//   },
//   users: {
//     _all: 'users/*',
//     get: 'users/get',
//     set: 'users/admin/set',
//     scope: 'user/admin/scope',
//     remove: 'users/admin/remove',
//   },
//   channels: {
//     _all: 'channels/*',
//     get: 'channels/get',
//     set: 'channels/set',
//     privileges: 'channels/privileges',
//     remove: 'channels/remove',
//   },
// };

// export default SCOPES_ENUM;
