import Login from "@/components/Login";
import MainLayout from "@/layouts/MainLayout";
import { montserratFont } from "@/theme/fonts";

export default function Page() {
    
  return (
    <MainLayout mainProps={{ className: `${montserratFont.className}` }}>
        <Login />
    </MainLayout>
  );
}


