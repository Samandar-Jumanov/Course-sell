import { HeadContent } from "@/components/Head";
import { MostCommonCourses } from "@/components/CommonCourses"
import Footer from "@/components/Footer"
export default function Home() {
  return (
        <div >
           <HeadContent />
           <MostCommonCourses />
           <Footer/>
        </div>
  );
}
