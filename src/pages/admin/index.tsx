import MainLayout from '@/layouts/MainLayout';
import Admin from '@/components/admin';

export default function index() {
  return <MainLayout pageTitle="Bingo - Admin">
    <Admin />
  </MainLayout>;
}
