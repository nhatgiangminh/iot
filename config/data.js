// data khởi tạo ban đầu
const date = new Date().valueOf();
exports.data = {
  role:
  [
    {
      value: 'ADMIN',
      text: 'Quản trị viên',
      active: true,
    },
    {
      value: 'TEACHER',
      text: 'Giảng viên',
      active: true,
    },
    {
      value: 'STUDENT',
      text: 'Sinh viên',
      active: true,
    },
  ],
  user:
  [
    {
      fullName: 'Quản trị viên',
      birthday: null,
      gender: 1,
      username: 'admin',
      major: 'Không',
      code: '00000000',
      rfid: null,
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'admin@gmail.com',
      role: 'ADMIN',
      createdAt: date,
      updatedAt: date,
    },
    {
      fullName: 'Giảng viên 1',
      birthday: null,
      gender: 1,
      username: 'teacher1',
      major: 'Kỹ thuật máy tính',
      code: '00000001',
      rfid: null,
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'teacher1@gmail.com',
      role: 'TEACHER',
      createdAt: date,
      updatedAt: date,
    },
    {
      fullName: 'Sinh viên 1',
      birthday: null,
      gender: 1,
      username: 'student1',
      major: 'Kỹ thuật máy tính',
      code: '18521187',
      rfid: '10 20 30 40',
      password: '$2a$10$y6SU8dMEg.rRSZxWCM7VMeWf3YbFph4zyE/drO.5M1ppX/JPJCKLy',
      email: 'student1@gmail.com',
      role: 'STUDENT',
      createdAt: date,
      updatedAt: date,
    },
  ],
};
