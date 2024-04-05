import { HeadContent } from "@/components/Head";
import { MostCommonCourses } from "@/components/CommonCourses"
import Footer from "@/components/Footer"
import DonateComponent from "@/components/Donation";

export default function Home() {
  return (
        <div >
           <HeadContent />
           <MostCommonCourses />
           <div className="container mx-auto px-4">
           <DonateComponent />
          </div>
           <Footer/>

        </div>
  );
}
