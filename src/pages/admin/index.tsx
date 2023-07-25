import MainLayout from '@/layouts/MainLayout';
import Admin from '@/components/admin';
import { montserratFont } from '@/theme/fonts';

export default function index() {
  return <MainLayout pageTitle="Bingo - Admin" mainProps={{ className: `${montserratFont.className}`}}>
    <Admin />
  </MainLayout>;
}
