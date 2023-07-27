import MainLayout from '@/layouts/MainLayout';
import Bingos from '@/components/admin/Bingos';
import { montserratFont } from '@/theme/fonts';
import RefCodes from '@/components/admin/RefCodes';

export default function index() {
  return <MainLayout pageTitle="Bingo - Admin" mainProps={{ className: `${montserratFont.className}`}}>
    <RefCodes />
  </MainLayout>
}







