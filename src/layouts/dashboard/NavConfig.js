// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: '대시보드',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: '로그인',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: '회원가입',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
];

export default navConfig;
