// data khởi tạo ban đầu
const date = new Date().valueOf();
exports.data = {
  role:
  [
    {
      value: 'ADMIN',
      text: {
        en: 'Administrator',
        vn: 'Quản trị viên',
      },
      active: true,
    },
    {
      value: 'CASHBACK_ADMIN',
      text: {
        en: 'Cashback administrator',
        vn: 'Quản trị viên cashback',
      },
      active: true,
    },
    {
      value: 'PARTNER',
      text: {
        en: 'Partner',
        vn: 'Đối tác',
      },
      active: true,
    },
    {
      value: 'CUSTOMER',
      text: {
        en: 'Customer',
        vn: 'Khách hàng',
      },
      active: true,
    },
  ],
  user:
  [
    {
      fullName: {
        en: 'Administrators cashback',
        vn: 'Quản trị viên cashback',
      },
      birthday: null,
      gender: 1,
      userName: 'admincashback',
      phone: '0999999999',
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'adminCashback@gmail.com',
      role: 'CASHBACK_ADMIN',
      createdAt: date,
      updatedAt: date,
    },
    {
      fullName: {
        en: 'Administrators',
        vn: 'Quản trị viên',
      },
      birthday: null,
      gender: 1,
      userName: 'admin',
      phone: '0888888888',
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'admin@gmail.com',
      role: 'ADMIN',
      createdAt: date,
      updatedAt: date,
    },
    {
      fullName: {
        en: 'Partner',
        vn: 'Đối tác',
      },
      birthday: null,
      gender: 1,
      userName: 'partner',
      phone: '0777777777',
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'partner@gmail.com',
      role: 'PARTNER',
      createdAt: date,
      updatedAt: date,
    },
    {
      fullName: {
        en: 'Customer',
        vn: 'Khách Hàng',
      },
      birthday: null,
      gender: 1,
      userName: 'customer',
      phone: '0666666666',
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'customer01@gmail.com',
      role: 'CUSTOMER',
      createdAt: date,
      updatedAt: date,
    },
  ],
};
