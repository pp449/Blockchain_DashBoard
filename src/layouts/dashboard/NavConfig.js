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
    title: '유저',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '상품',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '블로그',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
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
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
